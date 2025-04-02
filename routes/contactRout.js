const {GetContact , PostContact , EraseContact , DeleteContact} = require('../controllers/contact/contactController')
const authenticateToken = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router(); 

router.get('/contacts',authenticateToken, GetContact);

// Create a new contact
router.post('/contacts',authenticateToken,PostContact);

// Delete a contact by phone number
router.delete('/contacts/:phone',authenticateToken,DeleteContact);

// Clear all contacts
router.delete('/contacts', authenticateToken ,EraseContact);
module.exports = router; 