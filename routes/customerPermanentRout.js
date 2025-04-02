
const {DeleteCustomer , Purchase , CustomerDelete, PurchaseDelete , GetCustomer , PostCustomer } = require('../controllers/PermanentCustomer/Customer')
const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router(); 

router.delete('/api/customers', authenticateToken ,DeleteCustomer);
router.put('/api/customers/:phone/purchases',authenticateToken, Purchase);
router.delete('/api/customers/:phone',authenticateToken , CustomerDelete);
router.delete('/api/customers',authenticateToken , PurchaseDelete);
router.get('/api/customers',authenticateToken, GetCustomer);
router.post('/api/customers',authenticateToken, PostCustomer)
module.exports = router; 

