const SalesCosmo = require("../../model/SalesCosmo");
const Item = require("../../model/Cosmo");
const isValidObjectId = require("../../helper/checkIsObjectId");

module.exports.CosmosalesTransaction = async (req, res) => {
  try {
    const sales = new SalesCosmo(req.body);
    await sales.save();
    res.status(200).send({ message: "Transaction recorded" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.IndCosmo = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.CosmoTransactionDelete = async (req, res) => {
  try {
    const result = await SalesCosmo.deleteMany({});
    res.status(200).json({ message: `Deleted ${result.deletedCount} documents` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.CosmoDelete = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json({ message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.EditCosmo = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.Cosmos = async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.PostCosmo = async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.GetSell = async (req, res) => {
  try {
    const response = await SalesCosmo.find();
    res.json(response);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
