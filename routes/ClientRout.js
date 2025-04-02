const {UserClient , UserEdit , UserDelete} = require('../controllers/client/userClientcontroller')
const authenticateToken = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router(); 

router.get('/users',authenticateToken, UserClient);
router.put('/users/:id',authenticateToken, UserEdit);
router.delete('/users/:id',authenticateToken, UserDelete);
module.exports = router; 