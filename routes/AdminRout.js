const { AdminDelete, GetAdmin, AdminUpdate } = require('../controllers/UserAdmin/UserAdminController');
const authenticateToken = require('../middleware/authMiddleware'); // Import the JWT middleware

const express = require('express');
const router = express.Router();

// Import multer upload middleware
const { upload } = require('../middleware/multerMiddleware');

// Define your routes
router.delete('/usersAdmin/:username',authenticateToken, AdminDelete);

router.get('/usersAdmin',authenticateToken, GetAdmin);

router.put('/api/user/update', upload.single('image'),authenticateToken, AdminUpdate); // Use the multer middleware for file upload

module.exports = router;
