
const encryptPassword = require('../../helper/encriptionPassword');
const validatePassword = require('../../helper/validatePassword')
const User = require('../../model/scehemLogin'); 
const path = require('path');
const fs = require('fs')
const jwt = require('jsonwebtoken');

module.exports.RegisterUser =  async (req, res) => {
  console.log("hwllow")
  try {
    const { username, password , phone , hiredDate } = req.body;
  
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await encryptPassword(password); 
 
    const user = new User({ username, password: hashedPassword, role: 'User' , phone , hiredDate });

    await user.save();

    res.json({ message: 'User created successfully', user: { username: user.username, role: user.role } });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
}

module.exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username' });
    }

    // Validate the password
    const isMatch = await validatePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Generate JWT tokens
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // Set refresh token as a cookie
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true, // Makes the cookie HTTP-only
      secure: false,  // Works in both development and production, set to true in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "None",
    });

    // Define upload path
    const uploadPath = path.join(__dirname, 'uploads');
    const imageFormats = ['.jpg', '.jpeg', '.png', '.gif'];
    let foundImage = null;

    // Check if user's profile image exists
    for (const format of imageFormats) {
      const filePath = path.join(uploadPath, `${username}${format}`);
      if (fs.existsSync(filePath)) {
        foundImage = `${req.protocol}://${req.get('host')}/uploads/${username}${format}`;
        break;
      }
    }

    if (!foundImage) {
      foundImage = `${req.protocol}://${req.get('host')}/uploads/default.png`; // Default image URL
    }

    // Send success response with user details and access token in Authorization Bearer header
    res.json({
      message: 'Login successful',
      user: {
        username: user.username,
        role: user.role,
        image: foundImage,
        _id: user._id,
      },
      access_token: token, // Include the access token in the response body
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
};