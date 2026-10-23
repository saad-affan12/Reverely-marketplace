const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    customerId: {
      type: String,
      required: true,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Requirement title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    unit: {
      type: String,
      default: 'Units',
    },
    minBudget: {
      type: Number,
      default: 0,
    },
    maxBudget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: [0, 'Budget must be positive'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    deadline: {
      type: String,
      required: [true, 'Deadline is required'],
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'fulfilled', 'cancelled'],
      default: 'open',
      index: true,
    },
    offersCount: {
      type: Number,
      default: 0,
    },
    specifications: {
      type: [String],
      default: [],
    },
    attachments: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

requirementSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret.customId;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Requirement', requirementSchema);
