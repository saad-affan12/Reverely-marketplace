const { store, mockUser } = require('./mockDb');

jest.mock('../src/models/User', () => mockUser);

const request = require('supertest');
const app = require('../src/app');

beforeEach(() => {
  store.reset();
});

describe('Authentication & Authorization Endpoints', () => {
  it('should successfully register a customer', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test Customer',
      email: 'customer_test@example.com',
      password: 'password123',
      role: 'customer',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('customer_test@example.com');
    expect(res.body.data.user.role).toBe('customer');
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.passwordHash).toBeUndefined();
  });

  it('should successfully register a vendor with company name', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Pro Vendor',
      email: 'vendor_test@example.com',
      password: 'password123',
      role: 'vendor',
      companyName: 'Pro Vendor Solutions Pvt Ltd',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe('vendor');
    expect(res.body.data.user.companyName).toBe('Pro Vendor Solutions Pvt Ltd');
  });

  it('should reject public registration attempting admin role', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Fake Admin',
      email: 'admin_hacker@example.com',
      password: 'password123',
      role: 'admin',
    });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should reject duplicate email registration with 409', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'User One',
      email: 'duplicate@example.com',
      password: 'password123',
      role: 'customer',
    });

    const res = await request(app).post('/api/auth/register').send({
      name: 'User Two',
      email: 'duplicate@example.com',
      password: 'password456',
      role: 'customer',
    });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('should log in an existing user with valid credentials', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Login User',
      email: 'login@example.com',
      password: 'secretPassword123',
      role: 'customer',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'secretPassword123',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe('login@example.com');
  });

  it('should reject login with invalid password with 401', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Login User',
      email: 'login@example.com',
      password: 'secretPassword123',
      role: 'customer',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'wrongPassword',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should access /api/auth/me with a valid Bearer token', async () => {
    const registerRes = await request(app).post('/api/auth/register').send({
      name: 'Profile Tester',
      email: 'profile@example.com',
      password: 'password123',
      role: 'customer',
    });

    const token = registerRes.body.data.token;

    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.data.email).toBe('profile@example.com');
  });

  it('should reject access to protected routes without a token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
