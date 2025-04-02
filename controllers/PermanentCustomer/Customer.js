// controller.js
const { readDataFromFile, writeDataToFile } = require('../../helper/fileHelper'); // Import helper functions

module.exports.DeleteCustomer = (req, res) => {
  const { time } = req.body; // Extract time from request body

  readDataFromFile((err, data) => {
    if (err) return res.status(500).send('Error reading file');

    let customers = data;

    // Flag to check if any purchase was deleted
    let purchaseDeleted = false;

    customers = customers.map(customer => {
      // Find the index of the purchase to delete
      const purchaseIndex = customer.purchases.findIndex(purchase => purchase.time === time);

      if (purchaseIndex !== -1) {
        // Remove the purchase if found
        customer.purchases.splice(purchaseIndex, 1);
        purchaseDeleted = true;
      }

      return customer;
    });

    if (!purchaseDeleted) {
      return res.status(404).send('Purchase not found');
    }

    writeDataToFile(customers, (err) => {
      if (err) return res.status(500).send('Error writing file');
      res.status(200).send('Purchase deleted successfully');
    });
  });
};

module.exports.Purchase = (req, res) => {
  const { phone } = req.params;
  const purchaseDetails = req.body;

  readDataFromFile((err, data) => {
    if (err) return res.status(500).json({ message: 'Error reading data' });

    let customers = data;

    // Find the customer by phone number
    const customerIndex = customers.findIndex(customer => customer.phone === phone);
    if (customerIndex === -1) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Update the purchases
    customers[customerIndex].purchases.push(purchaseDetails);

    writeDataToFile(customers, (err) => {
      if (err) return res.status(500).json({ message: 'Error saving data' });
      res.json(customers[customerIndex]);
    });
  });
};

module.exports.CustomerDelete = (req, res) => {
  const { phone } = req.params;

  readDataFromFile((err, data) => {
    if (err) return res.status(500).json({ message: 'Error reading data' });

    let customers = data;
    const initialLength = customers.length;

    // Filter out the customer to be deleted
    customers = customers.filter(customer => customer.phone !== phone);

    if (customers.length === initialLength) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    writeDataToFile(customers, (err) => {
      if (err) return res.status(500).json({ message: 'Error saving data' });
      res.status(204).send(); // No content
    });
  });
};

module.exports.PurchaseDelete = (req, res) => {
  const { time } = req.body; // Extract time from request body

  readDataFromFile((err, data) => {
    if (err) return res.status(500).send('Error reading file');

    let customers = data;
    let purchaseDeleted = false;

    customers = customers.map(customer => {
      const purchaseIndex = customer.purchases.findIndex(purchase => purchase.time === time);

      if (purchaseIndex !== -1) {
        customer.purchases.splice(purchaseIndex, 1);
        purchaseDeleted = true;
      }

      return customer;
    });

    if (!purchaseDeleted) {
      return res.status(404).send('Purchase not found');
    }

    writeDataToFile(customers, (err) => {
      if (err) return res.status(500).send('Error writing file');
      res.status(200).send('Purchase deleted successfully');
    });
  });
};

module.exports.GetCustomer = (req, res) => {
  res.sendFile(path.join(__dirname, 'data.json'));
};

module.exports.PostCustomer = (req, res) => {
  readDataFromFile((err, customers) => {
    if (err) return res.status(500).send('Error reading file');

    const newCustomer = req.body;
    customers.push(newCustomer);

    writeDataToFile(customers, (err) => {
      if (err) return res.status(500).send('Error writing file');
      res.status(201).json(newCustomer);
    });
  });
};
