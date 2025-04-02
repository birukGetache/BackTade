const {PostTransaction , TotalTransaction , IndMed} = require('../controllers/transactionController/transactionController')
const authenticateToken = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router(); 

router.post('/transactions', authenticateToken , PostTransaction);
router.get('/api/transactions',authenticateToken , TotalTransaction);
router.get('/transactions',authenticateToken, IndMed);
module.exports = router; 