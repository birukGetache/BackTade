const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv'); // For managing environment variables
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('./model/scehemLogin'); // Adjust path to your user model
const Medicine = require ('./model/Medicine');
const UserSupplier = require('./model/UserSchema')
const totalSale = require('./model/SchemaTotalSale')
const Item = require('./model/Cosmo')
const Mark = require('./model/mark')
const SalesCosmo = require('./model/SalesCosmo')
dotenv.config(); // Load environment variables from a .env file
const Transaction = require('./model/Transaction');
const { body, validationResult } = require('express-validator');
const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://burab1742:ACtDMvExsvzY2w2J@cluster0.s1mvg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const uploadPath = path.join(__dirname, 'uploads');

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Multer setup for file uploading
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath); // Save uploaded files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    const { username } = req.body; // Extract username from request body
    const ext = path.extname(file.originalname); // Get the file extension
    const filename = `${username}${ext}`; // Create new filename
    cb(null, filename); // Set the filename for the uploaded file
  },
});
const upload = multer({ storage });

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(uploadPath));

// Register route
app.post('/register', async (req, res) => {
  console.log("hwllow")
  try {
    const { username, password , phone , hiredDate } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
    // Create the new user
    const user = new User({ username, password: hashedPassword, role: 'User' , phone , hiredDate });

    // Save the user to the database
    await user.save();

    // Respond with success
    res.json({ message: 'User created successfully', user: { username: user.username, role: user.role } });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});
app.post('/transactions', async (req, res) => {
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
});
app.get('/sales', async (req, res) => {
  try {
    const salesData = await Transaction.find({}); // Fetch all transactions

    // Get today's date
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(startOfDay.getDate() + 1); // Next day

    // Format the data to group by saler
    const groupedSales = salesData.reduce((acc, sale) => {
      if (!acc[sale.saler]) {
        acc[sale.saler] = { 
          pharmacist: sale.saler, 
          pharmacy: sale.pharmacy, // Add pharmacy name
          totalSales: 0, // Total sales
          todaySales: 0, // Today's sales
          latestSoldQuantity: 0, 
          salesDate: null 
        };
      }

      // Sum total sales for the pharmacist
      acc[sale.saler].totalSales += sale.soldQuantity;

      // Check if the sale is from today
      const saleDate = new Date(sale.date);
      if (saleDate >= startOfDay && saleDate < endOfDay) {
        acc[sale.saler].todaySales += sale.soldQuantity; // Summing up today's sold quantities
        acc[sale.saler].salesDate = sale.date; // Update to the most recent sale date
        acc[sale.saler].latestSoldQuantity = sale.soldQuantity; // Update latest sold quantity
      }

      return acc;
    }, {});

    res.json(Object.values(groupedSales));
  } catch (error) {
    res.status(500).json({ error: 'Error fetching sales data' });
  }
});





// In your server-side code, e.g., using Express.js
app.delete('/medicines/:id', async (req, res) => {
  const medicineId = req.params.id;

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
});

app.post('/saled/:totalSales', async (req, res) => {
  try {
    const salesValue = Number(req.params.totalSales);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to the start of the day

    console.log("Received sales:", salesValue);

    // Check if sales for today already exist
    let existingSale = await SchemaTotalSales.findOne({
      sentDate: { 
        $gte: today, 
        $lt: new Date(today.getTime() + 86400000) // End of today
      }
    });

    if (existingSale) {
      // Update the existing sales record
      existingSale.totleSale += salesValue;
      await existingSale.save();
      res.status(200).json({ message: 'Sales updated successfully', totalSales: existingSale.totleSale });
    } else {
      // Create a new sales record for today
      const newSale = new SchemaTotalSales({ totleSale: salesValue });
      await newSale.save();
      res.status(201).json({ message: 'Sales saved successfully', totalSales: newSale.totleSale });
    }
  } catch (error) {
    console.error("Error saving sales:", error);
    res.status(500).json({ error: 'An error occurred while saving sales' });
  }
});
app.post('/users', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('address').notEmpty().withMessage('Address is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phone, address } = req.body;

  try {
      const user = new UserSupplier({ name, email, phone, address });
      await user.save();
      res.status(201).json(user);
  } catch (error) {
      console.error('Error saving user:', error);
      res.status(500).json({ message: 'Error saving user', error: error.message });
  }
});
app.get('/users', async (req, res) => {
  try {
      const users = await UserSupplier.find(); // Fetch all users
      res.status(200).json(users); // Send users as a response
  } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});
app.put('/users/:id', async (req, res) => {
  try {
      const user = await UserSupplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(user);
  } catch (error) {
      res.status(500).json({ message: 'Error updating user' });
  }
});
app.delete('/users/:id', async (req, res) => {
  try {
      await UserSupplier.findByIdAndDelete(req.params.id);
      res.json({ message: 'User deleted' });
  } catch (error) {
      res.status(500).json({ message: 'Error deleting user' });
  }
});

app.get('/userss', async (req, res) => {
  try {
      // Fetch all users
      const users = await UserSupplier.find();
      
      // Get the total count of suppliers
      const supplierCount = await UserSupplier.countDocuments();

      // Send users and supplier count as a response
      res.status(200).json({
        supplierCount,  // Supplier count
        users           // User data
      });
  } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});
app.get('/usersss', async (req, res) => {
  try {
      // Fetch all users
      const users = await UserSupplier.find();
      
      // Get the total count of suppliers
      const supplierCount = await User.countDocuments();

      // Send users and supplier count as a response
      res.status(200).json({
        supplierCount,  // Supplier count
        users           // User data
      });
  } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});
// Endpoint to get customer and medicine data
app.get('/api/customers', (req, res) => {
  //res.sendFile(path.join(__dirname, 'data', 'data.json'));
  res.sendFile(path.join(__dirname, 'data.json'));
});
const filePath = path.join(__dirname, 'data.json'); // Adjust the path as needed

app.delete('/api/customers', (req, res) => {
console.log(req.body)
  const { time } = req.body; // Extract time from request body

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading file');

    let customers = JSON.parse(data);

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

    fs.writeFile(filePath, JSON.stringify(customers, null, 2), (err) => {
      if (err) return res.status(500).send('Error writing file');
      res.status(200).send('Purchase deleted successfully');
    });
  });
});

app.put('/api/customers/:phone/purchases', (req, res) => {
  const { phone } = req.params;
  const purchaseDetails = req.body;

  // Read the existing data
  fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
          return res.status(500).json({ message: 'Error reading data' });
      }

      let customers = JSON.parse(data);

      // Find the customer by phone number
      const customerIndex = customers.findIndex(customer => customer.phone === phone);
      if (customerIndex === -1) {
          return res.status(404).json({ message: 'Customer not found' });
      }

      // Update the purchases
      customers[customerIndex].purchases.push(purchaseDetails);

      // Write the updated data back to the file
      fs.writeFile(filePath, JSON.stringify(customers, null, 2), 'utf8', (err) => {
          if (err) {
              return res.status(500).json({ message: 'Error saving data' });
          }
          res.json(customers[customerIndex]);
      });
  });
});

app.put('/api/customers/:phone', (req, res) => {
    const { phone } = req.params;
    const purchaseDetails = req.body;
console.log(purchaseDetails)
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading data' });
        }

        let customers = JSON.parse(data);
        const customerIndex = customers.findIndex(customer => customer.phone === phone);

        if (customerIndex === -1) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Update the purchases array
        customers[customerIndex] = {
          ...customers[customerIndex], // Spread the existing properties
          ...purchaseDetails          // Overwrite or add new properties from purchaseDetails
        };

        fs.writeFile(filePath, JSON.stringify(customers, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving data' });
            }
            res.json(customers[customerIndex]);
        });
    });
});
app.get('/api/medicines', (req, res) => {
  res.sendFile(path.join(__dirname, 'data', 'medicines.json'));
});

const dataFilePath = path.join(__dirname, 'data.json');

// Helper function to read data.json
const readData = () => {
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
};

// Helper function to write data.json
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

app.put('/api/customers', (req, res) => {
  console.log("Received request to update purchase");
  
  const updatedPurchase = req.body; // The new purchase data
  const { time, medicine, quantity } = updatedPurchase; // Extract fields

  let data = readData(); // Read the current data from data.json

  let customerFound = false;
  let purchaseFound = false;

  // Find the customer and update their purchase based on multiple fields
  data = data.map((customer) => {
    const purchaseIndex = customer.purchases.findIndex(
      (purchase) =>
        purchase.time === time 
    );

    if (purchaseIndex !== -1) {
      // Customer and purchase found
      customer.purchases[purchaseIndex] = { ...customer.purchases[purchaseIndex], ...updatedPurchase };
      customerFound = true;
      purchaseFound = true;
    }

    return customer;
  });

  if (!customerFound || !purchaseFound) {
    return res.status(404).json({ message: 'Purchase not found' });
  }

  // Write the updated data back to the file
  writeData(data);

  res.status(200).json({ message: 'Purchase updated successfully' });
});
app.get('/transactions/:formattedDate', async (req, res) => {
  const formattedDate = req.params.formattedDate;

  try {
    const count = await Transaction.countDocuments({ date: formattedDate });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/transactions', async (req, res) => {
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
});
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    console.log("gmaes")
    console.log(transactions)
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
//app.get('/medicinesGroup/:id', (req, res) => {
//   const groupId = req.params.id; // Access the route parameter
//   console.log(`Fetching medicines for group ID: ${groupId}`);

//   // Filter medicines based on the group ID
//   const filteredMedicines = Medicine.filter(medicine => medicine.medicineGroup === groupId);

//   // Send the filtered medicines as a response
//   res.json(filteredMedicines);/totalSale
// });
app.get('/medicinesGroup/:id', async (req, res) => {
  const groupId = req.params.id; // Access the route parameter
  console.log(`Fetching medicines for group ID: ${groupId}`);

  try {
    // Fetch medicines from the database
    const medicines = await Medicine.find({ medicineGroup: groupId });
    
    // Send the filtered medicines as a response
    res.json(medicines);
  } catch (error) {
    console.error('Error fetching medicines:', error);
    res.status(500).send('Server Error');
  }
});
app.delete('/usersAdmin/:username', async (req, res) => {
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
});


app.get('/usersAdmin', async (req, res) => {
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
});
app.get('/medicineNumber', async (req, res) => {
  try {
    const result = await Medicine.find();
    console.log(result)
    res.send(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});
app.post('/saled', async (req, res) => {
  try {
    console.log("Received request body:");
    console.log(req.body.totalSales);

    // Create a new total sales record
    const totalSalea = new totalSale({
      totleSale: req.body.totalSales // Ensure you're using the correct field from the request body
    });

    // Save to the database
    await totalSalea.save();

    console.log("Total sale saved successfully!");
    res.status(200).json({ message: "Total sale saved successfully!" });
  } catch (error) {
    console.log("Error saving total sale:", error);
    res.status(500).json({ error: "Failed to save total sale." });
  }
});
app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.get('/totalsale', async (req, res) => {
  try {
    // Fetch all total sales data
    const result = await totalSale.find();
    res.status(200).json(result); // Send the result as a JSON response
  } catch (error) {
    console.log("Error fetching total sales:", error);
    res.status(500).json({ error: "Failed to fetch total sales." });
  }
});
app.get('/totalSell', async (req, res) => {
  console.log("hellow")
  try {
    // Fetch all total sales data
    const result = await totalSale.find();
    console.log(result);
    res.status(200).json(result); // Send the result as a JSON response
  } catch (error) {
    console.log("Error fetching total sales:", error);
    res.status(500).json({ error: "Failed to fetch total sales." });
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user in the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Username or password is incorrect' });
    }

    // Compare the provided password with the stored password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Username or password is incorrect' });
    }

    // Array of potential image formats
    const imageFormats = ['.jpg', '.jpeg', '.png', '.gif'];
    let foundImage = null;

    // Check for images with each format
    for (const format of imageFormats) {
      const filePath = path.join(uploadPath, `${username}${format}`);
      if (fs.existsSync(filePath)) {
        foundImage = `${req.protocol}://${req.get('host')}/uploads/${username}${format}`;
        break;
      }
    }

    // If no image was found, use a default image
    if (!foundImage) {
      foundImage = `${req.protocol}://${req.get('host')}/uploads/default.png`; // default image URL
    }

    // Respond with success message and user info (excluding the password)
    res.json({
      message: 'Login successful',
      user: {
        username: user.username,
        role: user.role,
        image: foundImage,
        _id: user._id,
        password: user.password,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});
app.put('/medicines/:id', async (req, res) => {
  console.log("Request received");
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
});

// Endpoint to delete a customer by phone number
app.delete('/api/customers/:phone', (req, res) => {
  const { phone } = req.params;

  fs.readFile(dataFilePath, 'utf8', (err, data) => {
      if (err) {
          return res.status(500).json({ message: 'Error reading data' });
      }

      let customers = JSON.parse(data);
      const initialLength = customers.length;

      // Filter out the customer to be deleted
      customers = customers.filter(customer => customer.phone !== phone);

      if (customers.length === initialLength) {
          return res.status(404).json({ message: 'Customer not found' });
      }

      fs.writeFile(dataFilePath, JSON.stringify(customers, null, 2), 'utf8', (err) => {
          if (err) {
              return res.status(500).json({ message: 'Error saving data' });
          }
          res.status(204).send(); // No content
      });
  });
});

// For purchase deletion
app.delete('/api/customers', (req, res) => {
  const { time } = req.body; // Extract time from request body

  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading file');

    let customers = JSON.parse(data);
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

    fs.writeFile(dataFilePath, JSON.stringify(customers, null, 2), (err) => {
      if (err) return res.status(500).send('Error writing file');
      res.status(200).send('Purchase deleted successfully');
    });
  });
});


app.get('/medcount', async (req, res) => {
  try {
    const count = await Medicine.countDocuments({});
    res.json(count);
  } catch (err) {
    res.status(500).json({ message: 'Error counting medicines' });
  }
});


app.put('/users/:id', async (req, res) => {
  console.log("hellow")
  try {
    const { id } = req.params;
    const { username, role } = req.body;
console.log(id);
console.log(username);
console.log(role);
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update only the username and role
    user.username = username || user.username;
    user.role = role || user.role;

    // Save the updated user
    const updatedUser = await user.save();

    // Return the updated user data
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      role: updatedUser.role,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});
// Update user route

app.post('/medicines', async (req, res) => {
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
});


// Read JSON data from file
const readDataFromFile = () => {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

// Write JSON data to file
const writeDataToFile = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};
app.post('/api/customers', (req, res) => {
  const customers = readDataFromFile();
  const newCustomer = req.body;
  customers.push(newCustomer);
  writeDataToFile(customers);
  res.status(201).json(newCustomer);
});

app.post('/mark', async (req, res) => {
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
});


app.get('/mark', async (req, res) => {
  try {
      const ress = await Mark.find(); // Await the result of the query
      res.json(ress); // Send the result back as JSON
  } catch (error) {
      console.error('Error fetching marks:', error);
      res.status(500).json({ message: 'Error fetching marks', error: error.message });
  }
});

app.delete('/user/:id', async (req, res) => {
  console.log("alert");
  try {
    const { id } = req.params;

    // Find and delete the user
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return a success message
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

app.get('/api/medicine/highest-sold', async (req, res) => {
  try {
    // Find the medicine with the highest soldQuantity
    const Transactions = await Transaction.findOne().sort({ soldQuantity: -1 }).exec();
    
    if (!Transactions) {
      return res.status(404).json({ message: 'No medicine found' });
    }

    res.json(Transactions);
  } catch (error) {
    console.error('Error fetching the medicine:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/json-count', (req, res) => {
  try {
    // Read the JSON file
    const data = fs.readFileSync('data.json', 'utf-8');
    
    // Parse the JSON data
    const jsonData = JSON.parse(data);
    
    // Get the count of items
    const count = jsonData.length;
    
    // Send the count as response
    res.json({ count });
  } catch (error) {
    console.error('Error reading or parsing the JSON file:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/medicines', async (req, res) => {
  try {
    const medicines = await Medicine.find();
    console.log("med")
    console.log(medicines)
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.put('/api/user/update', upload.single('image'), async (req, res) => {
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
});

// Contacts routes
const contactsFilePath = path.join(__dirname, 'data.json');
app.get('/contacts', (req, res) => {
  fs.readFile(contactsFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading file');
    }
    const contacts = JSON.parse(data);
    res.json(contacts);
  });
});

// Create a new contact
app.post('/contacts', (req, res) => {
  const newContacts = req.body;

  fs.writeFile(contactsFilePath, JSON.stringify(newContacts, null, 2), 'utf8', (err) => {
    if (err) {
      return res.status(500).send('Error writing file');
    }
    res.status(200).send('Contacts updated successfully');
  });
});

// Delete a contact by phone number
app.delete('/contacts/:phone', (req, res) => {
  const phone = req.params.phone;

  fs.readFile(contactsFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading file');
    }
    const contacts = JSON.parse(data);
    const updatedContacts = contacts.filter(contact => contact.phone !== phone);

    fs.writeFile(contactsFilePath, JSON.stringify(updatedContacts, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).send('Error writing file');
      }
      res.status(200).send('Contact deleted successfully');
    });
  });
});

// Clear all contacts
app.delete('/contacts', (req, res) => {
  fs.writeFile(contactsFilePath, JSON.stringify([], null, 2), 'utf8', (err) => {
    if (err) {
      return res.status(500).send('Error writing file');
    }
    res.status(200).send('All contacts cleared successfully');
  });
});


//COSMO

// Create a new item
app.post('/Cosmo', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all items
app.get('/Cosmo', async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific item
app.get('/Cosmo/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an item
app.put('/Cosmo/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an item
app.delete('/Cosmo/:id', async (req, res) => {
  try {
    console.log(req.params.id)
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.post('/salesTransaction', async (req, res)  =>{
  console.log(req.body)
  try{
  const sales = await new SalesCosmo(req.body);
  sales.save();
      res.status(200).send({ message: 'Transaction recorded' });
  }
  catch(error){
    console.error(error)
  }
})
app.get('/salesTransaction', async (req, res) => {
  try {
    // Execute the query and wait for the result
    const response = await SalesCosmo.find(); // Use await to get the actual data
    console.log(response); // Log the data for debugging
    res.json(response); // Send the response as JSON
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error"); // Handle the error gracefully
  }
});


app.delete('/CosmoTransactionDelte', async (req, res)=>{
  try {
    const result = await SalesCosmo.deleteMany({});
    console.log(`Deleted ${result.deletedCount} documents`);
  } catch (error) {
    console.error('Error deleting documents:', error);
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('Server is running on http://0.0.0.0:4000');
});

