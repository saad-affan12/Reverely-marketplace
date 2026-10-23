const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    requirementId: {
      type: String,
      required: true,
      index: true,
    },
    vendorId: {
      type: String,
      required: true,
      index: true,
    },
    vendorName: {
      type: String,
      required: true,
      trim: true,
    },
    vendorRating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    vendorTrustScore: {
      type: Number,
      default: 95,
      min: 0,
      max: 100,
    },
    price: {
      type: Number,
      required: [true, 'Quotation price is required'],
      min: [0, 'Price must be positive'],
    },
    deliveryDays: {
      type: Number,
      required: [true, 'Delivery days are required'],
      min: [1, 'Delivery days must be at least 1'],
    },
    warranty: {
      type: String,
      default: 'Standard Warranty',
    },
    includedServices: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
      default: '',
    },
    matchScore: {
      type: Number,
      default: 90,
      min: 0,
      max: 100,
    },
    badges: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

offerSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret.customId;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Offer', offerSchema);
