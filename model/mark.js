// models/Medicine.js
const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  medicineName: { type: String, required: true },
  medicineId: { type: String, required: true, unique:true }, // Updated to String for UUIDs
  unit: { type: String, required: true },
  quantity: { type: Number, required: true },
  soldIn: { type: String, },
  medicineGroup: { type: String, },
  tabletsPerStrip: { type: Number, },
  stripPerPk: { type: Number, default: 1 }, // Optional field
  singleSize: { type: Number, default: 1 },
  expirationDate: {
    type: Date, // Field to store the expiration date
    required: true, // Make it required if necessary
  },
 
  price:{type:Number, default:300},
  medicineDescription: { type: String },
  Why: { type: String  , default:"Shortage"},


  batchNumber: { type: String }, // Use Date if you want to work with date operations
});

const MarkTo = mongoose.model('MarkTo', medicineSchema);

module.exports = MarkTo;
