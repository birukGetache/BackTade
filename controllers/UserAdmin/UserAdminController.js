const User = require('../../model/scehemLogin'); 
module.exports.AdminDelete =   async (req, res) => {
    const { username } = req.params;
  
    try {
      const result = await User.deleteOne({ username });
  
      if (result.deletedCount === 0) {
        return res.status(404).send({ message: 'User not found' });
      }
  
      res.status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).send({ message: 'Error deleting user' });
    }
  }

  module.exports.GetAdmin =  async (req, res) => {
    try {
      // Fetch all users from the database
      const users = await User.find();
  
      // Remove passwords from the user data
      const usersWithoutPassword = users.map(user => {
        const userObj = user.toObject(); // Convert mongoose document to plain object
        delete userObj.password; // Remove the password field
        return userObj;
      });
  
      // Send the response without passwords
      res.json(usersWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
  }
  module.exports.AdminUpdate = async (req, res) => {
    try {
      const { _id, username, usernameold, password } = req.body;
      const imageFile = req.file;
  
      // Find user by ID
      const user = await User.findById(_id);
  
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      let updated = false;
  
      // Handle username update
      if (username && username !== user.username) {
        // Update username
        user.username = username;
        updated = true;
  
        // Delete old image if it exists
        if (usernameold && user.image) {
          const oldImageFilename = `${usernameold}${path.extname(user.image)}`;
          const oldImagePath = path.join('uploads', oldImageFilename);
  
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      }
  
      // Handle password update
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the new password
        user.password = hashedPassword;
        updated = true;
      }
  
      // Handle image update
      if (imageFile) {
        const newImageFilename = `${username}${path.extname(imageFile.originalname)}`;
        const tempImagePath = path.join('uploads', imageFile.filename);
        const newImagePath = path.join('uploads', newImageFilename);
  
        // Rename and move the new image to the final location
        fs.renameSync(tempImagePath, newImagePath);
  
        // Delete the old image if it exists
        if (user.image) {
          const oldImagePath = path.join('uploads', user.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
  
        // Update user image path
        user.image = newImageFilename;
        updated = true;
      }
  
      // Save the user only if any updates were made
      if (updated) {
        await user.save();
      }
  
      res.send(user);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).send('Error updating user');
    }
  }