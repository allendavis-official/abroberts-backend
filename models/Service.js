const mongoose = require('mongoose');

const serviceItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  enabled: {
    type: Boolean,
    default: true
  }
}, { _id: false });

const serviceSchema = new mongoose.Schema({
  packageName: {
    type: String,
    required: true
  },
  description: String,
  items: [serviceItemSchema],
  totalPrice: {
    type: Number,
    default: 0
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate total price before saving
serviceSchema.pre('save', function(next) {
  this.totalPrice = this.items
    .filter(item => item.enabled)
    .reduce((sum, item) => sum + item.price, 0);
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Service', serviceSchema);
