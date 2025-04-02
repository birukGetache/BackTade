const {Supplier , SupplierCount , UserSupplierPost } = require('../controllers/supplier/supplierController')
const authenticateToken = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router(); 
const { validateUserSupplierPost } = require('../middleware/userSupplierPost');

router.get('/userss', authenticateToken , Supplier);
router.get('/usersss',authenticateToken, SupplierCount);
router.post('/users',validateUserSupplierPost, authenticateToken , UserSupplierPost);
module.exports = router; 