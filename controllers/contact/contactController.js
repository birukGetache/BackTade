const { readContacts, writeContacts } = require("../../helper/fileHelper");

module.exports.GetContact = (req, res) => {
  readContacts((err, contacts) => {
    if (err) return res.status(500).send("Error reading file");
    res.json(contacts);
  });
};

module.exports.PostContact = (req, res) => {
  const newContacts = req.body;
  writeContacts(newContacts, (err) => {
    if (err) return res.status(500).send("Error writing file");
    res.status(200).send("Contacts updated successfully");
  });
};

module.exports.DeleteContact = (req, res) => {
  const phone = req.params.phone;
  readContacts((err, contacts) => {
    if (err) return res.status(500).send("Error reading file");

    const updatedContacts = contacts.filter((contact) => contact.phone !== phone);

    writeContacts(updatedContacts, (err) => {
      if (err) return res.status(500).send("Error writing file");
      res.status(200).send("Contact deleted successfully");
    });
  });
};

module.exports.EraseContact = (req, res) => {
  writeContacts([], (err) => {
    if (err) return res.status(500).send("Error writing file");
    res.status(200).send("All contacts cleared successfully");
  });
};
