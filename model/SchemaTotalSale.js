const mongoose = require('mongoose');

// Score Schema
const SchemaTotalSale = new mongoose.Schema({
  totleSale: {
    type: Number,
    required: true,
    min: 0 // Optional: Ensure that the score is not negative
  },
  sentDate: {
    type: Date,
    default: Date.now // Automatically stores the current date
  }
});

const SchemaTotalSales = mongoose.model('SchemaTotalSales', SchemaTotalSale);

module.exports = SchemaTotalSales;
