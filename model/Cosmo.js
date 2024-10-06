// models/Item.js
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  expireDate: { type: Date, required: true },
  price: { type: Number, required: true, min: 0 },
  tax: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Cosmo', ItemSchema);
