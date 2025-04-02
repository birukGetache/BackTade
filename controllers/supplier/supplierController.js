
const UserSupplier = require('../../model/UserSchema')
const User = require('../../model/scehemLogin');
const { body, validationResult } = require('express-validator');
module.exports.Supplier =  async (req, res) => {
    try {
        // Fetch all users
        const users = await UserSupplier.find();
        
        // Get the total count of suppliers
        const supplierCount = await UserSupplier.countDocuments();
  
        // Send users and supplier count as a response
        res.status(200).json({
          supplierCount,  // Supplier count
          users           // User data
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
  }

  module.exports.SupplierCount =  async (req, res) => {
    try {
        // Fetch all users
        const users = await UserSupplier.find();
        
        // Get the total count of suppliers
        const supplierCount = await User.countDocuments();
  
        // Send users and supplier count as a response
        res.status(200).json({
          supplierCount,  // Supplier count
          users           // User data
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
}
module.exports.UserSupplierPost =  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
  
    const { name, email, phone, address } = req.body;
  
    try {
        const user = new UserSupplier({ name, email, phone, address });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ message: 'Error saving user', error: error.message });
    }
  }

  module.exports.SupplierGive = async (req, res) => {
    try {
        const users = await UserSupplier.find(); // Fetch all users
        res.status(200).json(users); // Send users as a response
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
  }