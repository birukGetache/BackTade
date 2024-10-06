// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'mainAdmin' }, // Example field for role,
  phone:{type:Number ,required: true},
  hiredDate:{   type: Date, default: Date.now }
});

const tade = mongoose.model('tade', userSchema);

module.exports = tade;
