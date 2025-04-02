const {totalSaleFunction , HighSold , TotalSell , Sales } = require('../controllers/sales/salesController')
const {TotalSaleToday} = require('../controllers/sales/todayTotalSale');
const authenticateToken = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router(); 

router.get('/totalsale',authenticateToken, totalSaleFunction);
router.get('/api/medicine/highest-sold',authenticateToken ,HighSold);
router.get('/totalSell', authenticateToken ,TotalSell);
router.get('/sales', authenticateToken ,Sales);
router.post('/saled/:totalSales', authenticateToken , TotalSaleToday);
module.exports = router; 