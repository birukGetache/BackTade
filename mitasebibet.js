// app.put('/casher/:id', async (req, res) => {
//   console.log("hellow")
//   try {
//     const { id } = req.params;
//     const { username, role } = req.body;
// console.log(id);
// console.log(username);
// console.log(role);
//     // Find the user by ID
//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Update only the username and role
//     user.username = username || user.username;
//     user.role = role || user.role;

//     // Save the updated user
//     const updatedUser = await user.save();

//     // Return the updated user data
//     res.json({
//       _id: updatedUser._id,
//       username: updatedUser.username,
//       role: updatedUser.role,
//     });
//   } catch (error) {
//     console.error('Error updating user:', error);
//     res.status(500).json({ message: 'Error updating user', error: error.message });
//   }
// });