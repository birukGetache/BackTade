const Mark = require('../../model/mark')
const Medicine = require('../../model/Medicine')
const {isValidObjectId} = require('../../helper/checkIsObjectId');
module.exports.Medicines = async (req, res) => {
    try {
      const medicines = await Medicine.find();
      console.log("med")
      console.log(medicines)
      res.json(medicines);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
module.exports.MedicineSold =  async (req, res) => {
    console.log("Request recieved well knoes");
    try {
      const { quantity } = req.body;
      console.log("Quantity from request body:", quantity);
  
      // Ensure quantity is a number
      const numericQuantity = parseFloat(quantity);
  
      // Log the ID and check if the medicine exists
      const medicine = await Medicine.findOne({ medicineId: req.params.id }); // Use findOne
      console.log("Existing Medicine:", medicine);
  
      if (!medicine) {
        return res.status(404).json({ error: 'Medicine not found' });
      }
        if (!isValidObjectId(req.params.id)) {
          return res.status(400).json({ message: 'Invalid medicineId ID format' });
        }
  
      const updatedMedicine = await Medicine.findOneAndUpdate(
        { medicineId: req.params.id }, // Update to match on medicineId
        { quantity: numericQuantity }, // Update the required fields
        { new: true }
      );
  
      console.log("Updated Medicine:", updatedMedicine);
      res.json(updatedMedicine);
    } catch (err) {
      console.error("Error:", err.message);
      res.status(400).json({ error: err.message });
    }
  }

  module.exports.MedCount =  async (req, res) => {
    try {
      const count = await Medicine.countDocuments({});
      res.json(count);
    } catch (err) {
      res.status(500).json({ message: 'Error counting medicines' });
    }
  }

  module.exports.PostMedicine =  async (req, res) => {
  console.log(req.body)
  try {
    const { 
      medicineName,
        unit,
        price,
        medicineDescription,
        batchNumber,
        quantity,
        medicineId,
        stripPerPk,
        soldIn,
        tabletsPerStrip,
        medicineGroup,
        expirationDate
    } = req.body;

    // Create a new medicine document
    const newMedicine = new Medicine({
      medicineName,
        unit,
        price,
        medicineDescription,
        batchNumber,
        quantity,
        soldIn,
        medicineId,
        stripPerPk,
        tabletsPerStrip,
        medicineGroup,
        expirationDate
    });


    // Save the medicine to the database
    await newMedicine.save();

    // Respond with the created medicine
    res.status(201).json(newMedicine);
  } catch (error) {
    console.error('Error adding medicine:', error);
    res.status(500).json({ message: 'Error adding medicine', error: error.message });
  }
}
module.exports.DeleteMedicine  = async (req, res) => {
  const medicineId = req.params.id;
  if (!isValidObjectId(medicineId)) {
    return res.status(400).json({ message: 'Invalid medicineId ID format' });
  }

  try {
    const result = await Medicine.deleteOne({ medicineId: medicineId });

    // If the deletion was not successful, respond accordingly
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    res.status(200).send('Medicine deleted successfully');
  } catch (err) {
    console.error('Error deleting medicine:', err); 
    res.status(500).json({ error: 'Failed to delete medicine' });
  }
}
module.exports.MarkMedicinePost =  async (req, res) => {
  try {
    console.log(req.body)
      // Directly extract the properties from req.body
      const {
          medicineName,
          medicineId,
          unit,
          quantity,
          soldIn,
          medicineGroup,
          tabletsPerStrip,
          stripPerPk,
          singleSize,
          expirationDate,
          price,
          medicineDescription,
          batchNumber,
          Why
      } = req.body.medicine;

      const mar = new Mark({
          medicineName,
          medicineId,
          unit,
          quantity,
          soldIn,
          medicineGroup,
          tabletsPerStrip,
          stripPerPk,
          singleSize,
          expirationDate,
          price,
          medicineDescription,
          batchNumber,
          Why
      });

      await mar.save();
      res.status(201).json({ message: 'Mark saved successfully', mar });
  } catch (error) {
      console.error('Error saving mark:', error);
      res.status(500).json({ message: 'Error saving mark', error: error.message });
  }
}

module.exports.MarkMedicineGet =  async (req, res) => {
  try {
      const ress = await Mark.find(); // Await the result of the query
      res.json(ress); // Send the result back as JSON
  } catch (error) {
      console.error('Error fetching marks:', error);
      res.status(500).json({ message: 'Error fetching marks', error: error.message });
  }
}