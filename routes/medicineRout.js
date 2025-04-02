
const {Medicines , MedicineSold , MedCount , PostMedicine , DeleteMedicine , MarkMedicinePost , MarkMedicineGet} = require('../controllers/medicines/medicineController')
const authenticateToken = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router(); 

router.get('/medicines',authenticateToken, Medicines);
router.put('/medicines/:id',authenticateToken, MedicineSold);
router.get('/medcount',MedCount);
router.post('/medicines' , authenticateToken ,PostMedicine );
router.delete('/medicines/:id',authenticateToken , DeleteMedicine);
router.get('/mark',authenticateToken, MarkMedicineGet);
router.post('/mark',authenticateToken, MarkMedicinePost);
module.exports = router; 