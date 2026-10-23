const {
  store,
  mockUser,
  mockRequirement,
  mockOffer,
  mockOrder,
  mockProduct,
  mockReview,
} = require('./mockDb');

jest.mock('../src/models/User', () => mockUser);
jest.mock('../src/models/Requirement', () => mockRequirement);
jest.mock('../src/models/Offer', () => mockOffer);
jest.mock('../src/models/Order', () => mockOrder);
jest.mock('../src/models/Product', () => mockProduct);
jest.mock('../src/models/Review', () => mockReview);

const request = require('supertest');
const app = require('../src/app');

beforeEach(() => {
  store.reset();
});

describe('Reverse Multi-Vendor Marketplace End-to-End Workflow', () => {
  it('should execute the complete Customer -> 2 Vendor Quotes -> Compare -> Accept -> Order Lifecycle workflow', async () => {
    // 1. Register Customer
    const custRes = await request(app).post('/api/auth/register').send({
      name: 'Saad Ahmed',
      email: 'saad@example.com',
      password: 'password123',
      role: 'customer',
      companyName: 'Apex Innovations',
    });
    expect(custRes.status).toBe(201);
    const customerToken = custRes.body.data.token;
    const customerId = custRes.body.data.user.id;

    // 2. Register Vendor A
    const venARes = await request(app).post('/api/auth/register').send({
      name: 'Vendor A - PrintHub Solutions',
      email: 'vendora@example.com',
      password: 'password123',
      role: 'vendor',
      companyName: 'PrintHub Solutions Pvt Ltd',
    });
    expect(venARes.status).toBe(201);
    const vendorAToken = venARes.body.data.token;
    const vendorAId = venARes.body.data.user.id;

    // 3. Register Vendor B
    const venBRes = await request(app).post('/api/auth/register').send({
      name: 'Vendor B - TechCraft Textiles',
      email: 'vendorb@example.com',
      password: 'password123',
      role: 'vendor',
      companyName: 'TechCraft Textiles Ltd',
    });
    expect(venBRes.status).toBe(201);
    const vendorBToken = venBRes.body.data.token;
    const vendorBId = venBRes.body.data.user.id;

    // 4. Customer posts a requirement (100 customized T-shirts, ₹30,000 budget)
    const reqRes = await request(app)
      .post('/api/requirements')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        title: '100 Customized T-Shirts for Annual Tech Summit',
        category: 'Corporate Apparel',
        description: 'Black round neck cotton t-shirts with chest print',
        quantity: 100,
        unit: 'pieces',
        minBudget: 20000,
        maxBudget: 30000,
        location: 'Chennai, Tamil Nadu',
        deadline: '2026-11-10',
        specifications: ['180 GSM cotton', 'Navy blue with gold screen print'],
      });

    expect(reqRes.status).toBe(201);
    expect(reqRes.body.success).toBe(true);
    const requirementId = reqRes.body.data.id;
    expect(requirementId).toMatch(/^REQ-/);
    expect(reqRes.body.data.status).toBe('open');

    // 5. Vendor A submits offer: ₹27,500, 4 days delivery
    const offerARes = await request(app)
      .post(`/api/requirements/${requirementId}/offers`)
      .set('Authorization', `Bearer ${vendorAToken}`)
      .send({
        price: 27500,
        deliveryDays: 4,
        warranty: '30 Days Print Guarantee',
        includedServices: ['Free Sample Proof', 'Doorstep Delivery'],
        notes: 'Premium 180 GSM bio-washed cotton guaranteed.',
      });

    expect(offerARes.status).toBe(201);
    expect(offerARes.body.success).toBe(true);
    const offerAId = offerARes.body.data.id;
    expect(offerAId).toMatch(/^OFF-/);
    expect(offerARes.body.data.price).toBe(27500);

    // 6. Vendor B submits offer: ₹25,900, 6 days delivery
    const offerBRes = await request(app)
      .post(`/api/requirements/${requirementId}/offers`)
      .set('Authorization', `Bearer ${vendorBToken}`)
      .send({
        price: 25900,
        deliveryDays: 6,
        warranty: '15 Days Replacement',
        includedServices: ['Bulk Packaging', 'Standard Shipping'],
        notes: 'High quality cotton at very competitive price point.',
      });

    expect(offerBRes.status).toBe(201);
    expect(offerBRes.body.success).toBe(true);
    const offerBId = offerBRes.body.data.id;

    // 7. Customer views & compares both offers
    const compareRes = await request(app).get(`/api/requirements/${requirementId}/offers`);
    expect(compareRes.status).toBe(200);
    expect(compareRes.body.data.length).toBe(2);

    // 8. Customer accepts Vendor A's offer
    const acceptRes = await request(app)
      .post(`/api/offers/${offerAId}/accept`)
      .set('Authorization', `Bearer ${customerToken}`);

    expect(acceptRes.status).toBe(200);
    expect(acceptRes.body.success).toBe(true);
    const orderId = acceptRes.body.data.orderId;
    expect(orderId).toMatch(/^ORD-/);

    // Verify order was created in DB with correct initial state
    const orderRes = await request(app)
      .get(`/api/orders/${orderId}`)
      .set('Authorization', `Bearer ${customerToken}`);

    expect(orderRes.status).toBe(200);
    expect(orderRes.body.data.totalAmount).toBe(27500);
    expect(orderRes.body.data.status).toBe('confirmed');
    expect(orderRes.body.data.vendorId).toBe(vendorAId);
    expect(orderRes.body.data.timeline.length).toBe(6);

    // Verify requirement is now fulfilled
    const updatedReqRes = await request(app).get(`/api/requirements/${requirementId}`);
    expect(updatedReqRes.body.data.status).toBe('fulfilled');

    // Verify competing offer B is now rejected
    const offerBCheck = await request(app).get(`/api/offers/${offerBId}`);
    expect(offerBCheck.body.data.status).toBe('rejected');

    // Verify cannot accept a second offer on fulfilled requirement
    const doubleAcceptRes = await request(app)
      .post(`/api/offers/${offerBId}/accept`)
      .set('Authorization', `Bearer ${customerToken}`);
    expect(doubleAcceptRes.status).toBe(400);

    // 9. Vendor A advances order status: confirmed -> processing -> packed -> shipped -> delivered
    const advanceRes1 = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${vendorAToken}`)
      .send({ status: 'processing' });
    expect(advanceRes1.status).toBe(200);
    expect(advanceRes1.body.data.status).toBe('processing');

    const advanceRes2 = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${vendorAToken}`)
      .send({ status: 'delivered' });
    expect(advanceRes2.status).toBe(200);
    expect(advanceRes2.body.data.status).toBe('delivered');

    // 10. Customer leaves a review on the delivered order
    const reviewRes = await request(app)
      .post(`/api/reviews/order/${orderId}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        rating: 5,
        comment: 'Outstanding quality T-shirts and delivered right on time! Highly recommended.',
      });
    expect(reviewRes.status).toBe(201);
    expect(reviewRes.body.success).toBe(true);

    // 11. Verify health endpoint
    const healthRes = await request(app).get('/api/health');
    expect(healthRes.status).toBe(200);
    expect(healthRes.body.status).toBe('healthy');
  });
});
