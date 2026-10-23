const User = require('../models/User');
const Requirement = require('../models/Requirement');
const Offer = require('../models/Offer');
const Order = require('../models/Order');
const Product = require('../models/Product');

// GET /api/admin/stats
const getAdminStats = async (req, res, next) => {
  try {
    const [
      customersCount,
      vendorsCount,
      productsCount,
      requirementsCount,
      offersCount,
      orders,
    ] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'vendor' }),
      Product.countDocuments({ isActive: true }),
      Requirement.countDocuments(),
      Offer.countDocuments(),
      Order.find({}, 'totalAmount'),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    res.json({
      success: true,
      data: {
        totalCustomers: customersCount,
        totalVendors: vendorsCount,
        totalProducts: productsCount,
        totalRequirements: requirementsCount,
        totalOffers: offersCount,
        totalOrders: orders.length,
        totalRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users
const getUsers = async (req, res, next) => {
  try {
    const { role, search, verified } = req.query;
    const filter = {};

    if (role && role !== 'all') {
      filter.role = role;
    }

    if (verified !== undefined && verified !== 'all') {
      filter.verified = verified === 'true';
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users.map((u) => u.toJSON()),
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/users/:id/verify
const toggleUserVerification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      $or: [{ customId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    user.verified = !user.verified;
    await user.save();

    res.json({
      success: true,
      message: `User verification updated to: ${user.verified ? 'Verified' : 'Unverified'}`,
      data: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getUsers,
  toggleUserVerification,
};
