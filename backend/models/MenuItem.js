const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  originalText: { type: String, required: true },
  imageUrl: { type: String, default: null },
  imageType: { type: String, enum: ['ai', 'photo'], default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// ✅ Async-safe pre-save hook: no next/done
menuItemSchema.pre('save', async function () {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
