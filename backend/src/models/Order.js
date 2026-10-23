const mongoose = require('mongoose');

const timelineItemSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        'requirement_accepted',
        'confirmed',
        'processing',
        'packed',
        'shipped',
        'delivered',
      ],
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    timestamp: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    requirementId: {
      type: String,
      sparse: true,
      index: true,
    },
    offerId: {
      type: String,
      sparse: true,
      index: true,
    },
    productId: {
      type: String,
      sparse: true,
    },
    customerId: {
      type: String,
      required: true,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    vendorId: {
      type: String,
      required: true,
      index: true,
    },
    vendorName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: [
        'requirement_accepted',
        'confirmed',
        'processing',
        'packed',
        'shipped',
        'delivered',
      ],
      default: 'confirmed',
      index: true,
    },
    expectedDelivery: {
      type: String,
      required: true,
    },
    timeline: {
      type: [timelineItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret.customId;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Order', orderSchema);
