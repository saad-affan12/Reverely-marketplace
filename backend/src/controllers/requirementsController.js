const Requirement = require('../models/Requirement');
const Offer = require('../models/Offer');

// GET /api/requirements
const getRequirements = async (req, res, next) => {
  try {
    const { search, category, status, customerId } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (category && category !== 'all' && category !== 'All Categories') {
      filter.category = new RegExp(category, 'i');
    }

    if (customerId) {
      filter.customerId = customerId;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { customId: { $regex: search, $options: 'i' } },
      ];
    }

    const requirements = await Requirement.find(filter).sort({ createdAt: -1 });

    // Sync live offer counts
    const reqIds = requirements.map((r) => r.customId);
    const offerCounts = await Offer.aggregate([
      { $match: { requirementId: { $in: reqIds } } },
      { $group: { _id: '$requirementId', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    offerCounts.forEach((c) => {
      countMap[c._id] = c.count;
    });

    const populated = requirements.map((r) => {
      const json = r.toJSON();
      json.offersCount = countMap[r.customId] !== undefined ? countMap[r.customId] : r.offersCount;
      return json;
    });

    res.json({
      success: true,
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/requirements/:id
const getRequirementById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const requirement = await Requirement.findOne({
      $or: [{ customId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!requirement) {
      return res.status(404).json({
        success: false,
        message: 'Requirement not found.',
      });
    }

    const liveOfferCount = await Offer.countDocuments({ requirementId: requirement.customId });
    const result = requirement.toJSON();
    result.offersCount = liveOfferCount;

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/requirements
const createRequirement = async (req, res, next) => {
  try {
    const {
      title,
      category,
      description,
      quantity,
      unit,
      minBudget,
      maxBudget,
      location,
      deadline,
      specifications,
      attachments,
    } = req.body;

    if (!title || !category || !description || !quantity || !maxBudget || !location || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields.',
      });
    }

    // Generate unique REQ ID
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const customId = `REQ-${randomCode}`;

    const newReq = await Requirement.create({
      customId,
      customerId: req.user.id,
      customerName: req.user.name,
      title: title.trim(),
      category: category.trim(),
      description: description.trim(),
      quantity: Number(quantity),
      unit: unit || 'Units',
      minBudget: Number(minBudget) || 0,
      maxBudget: Number(maxBudget),
      location: location.trim(),
      deadline: deadline.trim(),
      status: 'open',
      offersCount: 0,
      specifications: Array.isArray(specifications) ? specifications : [],
      attachments: Array.isArray(attachments) ? attachments : [],
    });

    res.status(201).json({
      success: true,
      message: 'Requirement posted successfully.',
      data: newReq.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/requirements/:id/status
const updateRequirementStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['open', 'closed', 'fulfilled', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const requirement = await Requirement.findOne({
      $or: [{ customId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!requirement) {
      return res.status(404).json({
        success: false,
        message: 'Requirement not found.',
      });
    }

    // Check ownership or admin
    if (req.user.role !== 'admin' && requirement.customerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You do not own this requirement.',
      });
    }

    requirement.status = status;
    await requirement.save();

    res.json({
      success: true,
      message: `Requirement status updated to ${status}.`,
      data: requirement.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/requirements/:id
const deleteRequirement = async (req, res, next) => {
  try {
    const { id } = req.params;

    const requirement = await Requirement.findOne({
      $or: [{ customId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!requirement) {
      return res.status(404).json({
        success: false,
        message: 'Requirement not found.',
      });
    }

    if (req.user.role !== 'admin' && requirement.customerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You do not own this requirement.',
      });
    }

    requirement.status = 'cancelled';
    await requirement.save();

    res.json({
      success: true,
      message: 'Requirement cancelled successfully.',
      data: requirement.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRequirements,
  getRequirementById,
  createRequirement,
  updateRequirementStatus,
  deleteRequirement,
};
