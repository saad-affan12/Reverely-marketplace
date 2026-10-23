const Review = require('../models/Review');
const Order = require('../models/Order');

// GET /api/vendors/:id/reviews
const getVendorReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reviews = await Review.find({ vendorId: id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reviews.map((r) => r.toJSON()),
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/orders/:id/reviews
const createOrderReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Rating and comment are required.',
      });
    }

    const order = await Order.findOne({
      $or: [{ customId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Reviews can only be submitted for completed/delivered orders.',
      });
    }

    if (req.user.role !== 'admin' && order.customerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Only the customer who placed this order can review it.',
      });
    }

    const existingReview = await Review.findOne({ orderId: order.customId });
    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: 'A review has already been submitted for this order.',
      });
    }

    const newReview = await Review.create({
      orderId: order.customId,
      customerId: req.user.id,
      customerName: req.user.name,
      vendorId: order.vendorId,
      rating: Number(rating),
      comment: comment.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully.',
      data: newReview.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVendorReviews,
  createOrderReview,
};
