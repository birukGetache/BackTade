
const express = require('express');
const router = express.Router();
const { refreshToken } = require('../controllers/authController/authRoutes');

router.get('/refreshtoken', refreshToken);


module.exports = router;
