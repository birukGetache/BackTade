const { body } = require('express-validator');

// Middleware to handle validation for supplier post
const validateUserSupplierPost = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('address').notEmpty().withMessage('Address is required')
];

module.exports = { validateUserSupplierPost };
