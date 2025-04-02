
const Transaction = require('../../model/Transaction');
module.exports.Transaction = async (req, res) => {

  try {
    // Remove _id from req.body if it exists
    const newTransactionData = { ...req.body };
    delete newTransactionData._id; // Prevent MongoDB from trying to use an existing _id

    const newTransaction = new Transaction(newTransactionData);
    const savedTransaction = await newTransaction.save();
    res.json(savedTransaction);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}

module.exports.PostTransaction =  async (req, res) => {
  const {
    medicineId,
    medicineName,
    soldQuantity,
    totalAmount,
    quantity,
    expireDate,
    price,
    date,
    saler
  } = req.body;

  try {
    // Remove _id from req.body if it exists
    const newTransactionData = { ...req.body };
    delete newTransactionData._id; // Prevent MongoDB from trying to use an existing _id

    const newTransaction = new Transaction(newTransactionData);
    const savedTransaction = await newTransaction.save();
    res.json(savedTransaction);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}
module.exports.TotalTransaction = async (req, res) => {
    try {
      const transactions = await Transaction.find();
      console.log("gmaes")
      console.log(transactions)
      res.json(transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  module.exports.IndMed =   async (req, res) => {
    const { medicineId } = req.query; // Get the medicineId from query parameters
  
    if (!medicineId) {
      return res.status(400).json({ error: 'Medicine ID is required' });
    }
  
    try {
      const transactions = await Transaction.find({ medicineId }).sort({ date: -1 });
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching transactions' });
    }
  }