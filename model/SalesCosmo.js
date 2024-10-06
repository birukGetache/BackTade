const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  pharamacist: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('CosmoTransaction', ItemSchema);
