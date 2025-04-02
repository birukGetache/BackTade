const Medicine = require('../../model/Medicine');
const isValidObjectId = require('../../helper/checkIsObjectId'); // Import the helper

module.exports.MedicineGroupId = async (req, res) => {
  const groupId = req.params.id; // Access the route parameter
  console.log(`Fetching medicines for group ID: ${groupId}`);

  // Check if the groupId is a valid ObjectId
  if (!isValidObjectId(groupId)) {
    return res.status(400).json({ message: 'Invalid group ID format' });
  }

  try {
    // Fetch medicines from the database based on the valid groupId
    const medicines = await Medicine.find({ medicineGroup: groupId });
    
    // Send the filtered medicines as a response
    res.json(medicines);
  } catch (error) {
    console.error('Error fetching medicines:', error);
    res.status(500).send('Server Error');
  }
};
