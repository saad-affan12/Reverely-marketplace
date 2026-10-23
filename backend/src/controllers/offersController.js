const Offer = require('../models/Offer');
const Requirement = require('../models/Requirement');
const Order = require('../models/Order');

// GET /api/requirements/:id/offers
const getOffersByRequirementId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const offers = await Offer.find({ requirementId: id }).sort({ price: 1 });

    res.json({
      success: true,
      data: offers.map((o) => o.toJSON()),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/offers
const getOffers = async (req, res, next) => {
  try {
    const { vendorId } = req.query;
    const filter = {};

    if (vendorId) {
      filter.vendorId = vendorId;
    } else if (req.user && req.user.role === 'vendor') {
      filter.vendorId = req.user.id;
    }

    const offers = await Offer.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: offers.map((o) => o.toJSON()),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/offers/:id
const getOfferById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findOne({
      $or: [{ customId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer quotation not found.',
      });
    }

    res.json({
      success: true,
      data: offer.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/requirements/:id/offers
const submitOffer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      price,
      deliveryDays,
      warranty,
      includedServices,
      notes,
    } = req.body;

    if (!price || !deliveryDays) {
      return res.status(400).json({
        success: false,
        message: 'Quotation price and delivery days are required.',
      });
    }

    const requirement = await Requirement.findOne({
      $or: [{ customId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!requirement) {
      return res.status(404).json({
        success: false,
        message: 'Requirement not found to submit offer for.',
      });
    }

    if (requirement.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: `Cannot submit offer: Requirement is currently ${requirement.status}.`,
      });
    }

    // Check if vendor already has an active offer
    const existingOffer = await Offer.findOne({
      requirementId: requirement.customId,
      vendorId: req.user.id,
      status: 'pending',
    });

    if (existingOffer) {
      return res.status(409).json({
        success: false,
        message: 'You already have an active pending quotation for this requirement.',
      });
    }

    // Calculate match score and algorithmic badges
    let matchScore = 85;
    const diffRatio = (requirement.maxBudget - Number(price)) / requirement.maxBudget;
    matchScore += Math.round(diffRatio * 20);
    if (Number(deliveryDays) <= 3) matchScore += 3;
    if (Array.isArray(includedServices) && includedServices.length >= 3) matchScore += 2;
    matchScore = Math.min(Math.max(matchScore, 70), 99);

    const badges = [];
    if (Number(price) <= requirement.maxBudget * 0.9) badges.push('BEST VALUE');
    if (Number(deliveryDays) <= 4) badges.push('FASTEST DELIVERY');
    if (badges.length === 0) badges.push('TOP RATED');

    const randomCode = Math.floor(500 + Math.random() * 500);
    const customId = `OFF-${randomCode}`;

    const newOffer = await Offer.create({
      customId,
      requirementId: requirement.customId,
      vendorId: req.user.id,
      vendorName: req.user.companyName || req.user.name,
      vendorRating: 4.8,
      vendorTrustScore: 95,
      price: Number(price),
      deliveryDays: Number(deliveryDays),
      warranty: warranty || 'Standard Warranty',
      includedServices: Array.isArray(includedServices) ? includedServices : [],
      notes: notes || '',
      matchScore,
      badges,
      status: 'pending',
    });

    // Increment requirement offer count
    await Requirement.updateOne(
      { _id: requirement._id },
      { $inc: { offersCount: 1 } }
    );

    res.status(201).json({
      success: true,
      message: 'Quotation submitted successfully.',
      data: newOffer.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/offers/:id/accept
const acceptOffer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const offer = await Offer.findOne({
      $or: [{ customId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer quotation not found.',
      });
    }

    if (offer.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `This offer is already marked as ${offer.status}.`,
      });
    }

    const requirement = await Requirement.findOne({ customId: offer.requirementId });

    if (!requirement) {
      return res.status(404).json({
        success: false,
        message: 'Associated requirement not found.',
      });
    }

    if (requirement.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: `Requirement is already ${requirement.status}. Cannot accept offer.`,
      });
    }

    // Verify ownership
    if (req.user.role !== 'admin' && requirement.customerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You are not the owner of this requirement.',
      });
    }

    // 1. Mark this offer as accepted
    offer.status = 'accepted';
    await offer.save();

    // 2. Reject all other pending offers for this requirement
    await Offer.updateMany(
      {
        requirementId: requirement.customId,
        customId: { $ne: offer.customId },
        status: 'pending',
      },
      { status: 'rejected' }
    );

    // 3. Update requirement status to fulfilled
    requirement.status = 'fulfilled';
    await requirement.save();

    // 4. Create new Order with 6-stage lifecycle
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() + (offer.deliveryDays || 5));
    const expectedDelivery = expectedDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const timeline = [
      {
        status: 'requirement_accepted',
        label: 'Requirement Accepted',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        completed: true,
      },
      {
        status: 'confirmed',
        label: 'Order Confirmed',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        completed: true,
      },
      {
        status: 'processing',
        label: 'Processing & Customization',
        timestamp: 'In Progress',
        completed: false,
      },
      {
        status: 'packed',
        label: 'Packed & Quality Checked',
        timestamp: 'Pending',
        completed: false,
      },
      {
        status: 'shipped',
        label: 'Shipped via Express Courier',
        timestamp: 'Pending',
        completed: false,
      },
      {
        status: 'delivered',
        label: 'Delivered to Customer',
        timestamp: 'Pending',
        completed: false,
      },
    ];

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = await Order.create({
      customId: orderId,
      requirementId: requirement.customId,
      offerId: offer.customId,
      customerId: requirement.customerId,
      customerName: requirement.customerName,
      vendorId: offer.vendorId,
      vendorName: offer.vendorName,
      title: requirement.title,
      totalAmount: offer.price,
      status: 'confirmed',
      expectedDelivery,
      timeline,
    });

    res.json({
      success: true,
      message: 'Offer accepted successfully. Order created!',
      data: {
        offer: offer.toJSON(),
        orderId: newOrder.customId,
        order: newOrder.toJSON(),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOffersByRequirementId,
  getOffers,
  getOfferById,
  submitOffer,
  acceptOffer,
};
