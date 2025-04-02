// fileHelper.js
const fs = require("fs");
const path = require("path");

const contactsFilePath = path.join(__dirname, "data.json");

// Read contacts from file
const readContacts = (callback) => {
  fs.readFile(contactsFilePath, "utf8", (err, data) => {
    if (err) return callback(err, null);
    callback(null, JSON.parse(data));
  });
};

// Write contacts to file
const writeContacts = (contacts, callback) => {
  fs.writeFile(contactsFilePath, JSON.stringify(contacts, null, 2), "utf8", (err) => {
    callback(err);
  });
};

// Read customer data from file (can be reused)
const readDataFromFile = (callback) => {
  fs.readFile(contactsFilePath, 'utf8', (err, data) => {
    if (err) return callback(err, null);
    callback(null, JSON.parse(data));
  });
};

// Write customer data to file (can be reused)
const writeDataToFile = (data, callback) => {
  fs.writeFile(contactsFilePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
    callback(err);
  });
};

module.exports = { readContacts, writeContacts, readDataFromFile, writeDataToFile };
