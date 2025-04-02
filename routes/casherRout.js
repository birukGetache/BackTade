const {loginUser , RegisterUser} = require('../controllers/casherController/casher')
const express = require('express');
const router = express.Router(); 

router.post('/login', loginUser);
router.post('/register' , RegisterUser);
module.exports = router; 