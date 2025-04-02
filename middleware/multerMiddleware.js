const multer = require('multer');
const path = require('path');

// Set up the multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads'; // Path where files will be saved
    cb(null, uploadPath); // Specify the destination folder
  },
  filename: (req, file, cb) => {
    const { username } = req.body; // Get the username from the request body
    const ext = path.extname(file.originalname); // Get the file extension
    const filename = `${username}${ext}`; // Create a new filename
    cb(null, filename); // Set the filename for the uploaded file
  },
});

// Multer upload middleware setup
const upload = multer({ storage });

module.exports = { upload };
