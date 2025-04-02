const {CustomerCount} = require('../controllers/customer/customerController')
const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router(); 

router.get('/api/json-count', authenticateToken ,CustomerCount);
module.exports = router; 