const Order = require('../models/Order');

const STATUS_SEQUENCE = [
  'requirement_accepted',
  'confirmed',
  'processing',
  'packed',
  'shipped',
  'delivered',
];

// GET /api/orders
const getOrders = async (req, res, next) => {
  try {
    const filter = {};

    if (req.user) {
      if (req.user.role === 'customer') {
        filter.customerId = req.user.id;
      } else if (req.user.role === 'vendor') {
        filter.vendorId = req.user.id;
      }
      // Admin sees all orders
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders.map((o) => o.toJSON()),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({
      $or: [{ customId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    // Authorization check
    if (
      req.user &&
      req.user.role !== 'admin' &&
      order.customerId !== req.user.id &&
      order.vendorId !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You do not have permission to view this order.',
      });
    }

    res.json({
      success: true,
      data: order.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !STATUS_SEQUENCE.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${STATUS_SEQUENCE.join(', ')}`,
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

    // Only vendor assigned to order or admin can change status
    if (req.user.role !== 'admin' && order.vendorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Only the assigned vendor or admin can update order fulfillment status.',
      });
    }

    const targetIndex = STATUS_SEQUENCE.indexOf(status);

    // Update timeline stages
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updatedTimeline = order.timeline.map((item) => {
      const itemIndex = STATUS_SEQUENCE.indexOf(item.status);
      if (itemIndex <= targetIndex) {
        return {
          status: item.status,
          label: item.label,
          completed: true,
          timestamp: item.timestamp === 'Pending' || item.timestamp === 'In Progress' ? nowTime : item.timestamp,
        };
      }
      return item;
    });

    order.status = status;
    order.timeline = updatedTimeline;
    await order.save();

    res.json({
      success: true,
      message: `Order status advanced to ${status}.`,
      data: order.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrders,
  getOrderById,
  updateOrderStatus,
};
