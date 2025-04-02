const { readContacts } = require("../../helper/fileHelper");

module.exports.CustomerCount = (req, res) => {
  try {
    // Use the helper function to read contacts from the JSON file
    const contacts = readContacts();
    
    // Get the count of items
    const count = contacts.length;
    
    // Send the count as a response
    res.json({ count });
  } catch (error) {
    console.error('Error reading or parsing the JSON file:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
