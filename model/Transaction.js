// models/Transaction.js

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  medicineId: String,
  medicineName: String,
  soldQuantity: Number,
  totalAmount: Number,
  quantity:String,
  expireDate:String,
  price:Number,
  date: Date,
  Method:String,
  saler:String
});

module.exports = mongoose.model('Transaction', transactionSchema);
