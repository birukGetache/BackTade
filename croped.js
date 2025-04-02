// app.put('/api/customers/:phone', (req, res) => {
//     const { phone } = req.params;
//     const purchaseDetails = req.body;
// console.log(purchaseDetails)
//     fs.readFile(filePath, 'utf8', (err, data) => {
//         if (err) {
//             return res.status(500).json({ message: 'Error reading data' });
//         }

//         let customers = JSON.parse(data);
//         const customerIndex = customers.findIndex(customer => customer.phone === phone);

//         if (customerIndex === -1) {
//             return res.status(404).json({ message: 'Customer not found' });
//         }

//         // Update the purchases array
//         customers[customerIndex] = {
//           ...customers[customerIndex], // Spread the existing properties
//           ...purchaseDetails          // Overwrite or add new properties from purchaseDetails
//         };

//         fs.writeFile(filePath, JSON.stringify(customers, null, 2), 'utf8', (err) => {
//             if (err) {
//                 return res.status(500).json({ message: 'Error saving data' });
//             }
//             res.json(customers[customerIndex]);
//         });
//     });
// });


// const dataFilePath = path.join(__dirname, 'data.json');

// // Helper function to read data.json
// const readData = () => {
//   const data = fs.readFileSync(dataFilePath);
//   return JSON.parse(data);
// };

// // Helper function to write data.json
// const writeData = (data) => {
//   fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
// };

// app.put('/api/customers', (req, res) => {
//   console.log("Received request to update purchase");
  
//   const updatedPurchase = req.body; // The new purchase data
//   const { time, medicine, quantity } = updatedPurchase; // Extract fields

//   let data = readData(); // Read the current data from data.json

//   let customerFound = false;
//   let purchaseFound = false;

//   // Find the customer and update their purchase based on multiple fields
//   data = data.map((customer) => {
//     const purchaseIndex = customer.purchases.findIndex(
//       (purchase) =>
//         purchase.time === time 
//     );

//     if (purchaseIndex !== -1) {
//       // Customer and purchase found
//       customer.purchases[purchaseIndex] = { ...customer.purchases[purchaseIndex], ...updatedPurchase };
//       customerFound = true;
//       purchaseFound = true;
//     }

//     return customer;
//   });

//   if (!customerFound || !purchaseFound) {
//     return res.status(404).json({ message: 'Purchase not found' });
//   }

//   // Write the updated data back to the file
//   writeData(data);

//   res.status(200).json({ message: 'Purchase updated successfully' });
// });
// app.get('/transactions/:formattedDate', async (req, res) => {
//     const formattedDate = req.params.formattedDate;
  
//     try {
//       const count = await Transaction.countDocuments({ date: formattedDate });
//       res.json({ count });
//     } catch (error) {
//       res.status(500).json({ error: 'An error occurred' });
//     }
//   });

//app.get('/medicinesGroup/:id', (req, res) => {
//   const groupId = req.params.id; // Access the route parameter
//   console.log(`Fetching medicines for group ID: ${groupId}`);

//   // Filter medicines based on the group ID
//   const filteredMedicines = Medicine.filter(medicine => medicine.medicineGroup === groupId);

//   // Send the filtered medicines as a response
//   res.json(filteredMedicines);/totalSale
// });

// app.get('/medicineNumber', async (req, res) => {
//   try {
//     const result = await Medicine.find();
//     console.log(result)
//     res.send(result);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching users', error: error.message });
//   }
// });

// app.post('/saled', async (req, res) => {
//   try {
//     console.log("Received request body:");
//     console.log(req.body.totalSales);

//     // Create a new total sales record
//     const totalSalea = new totalSale({
//       totleSale: req.body.totalSales // Ensure you're using the correct field from the request body
//     });

//     // Save to the database
//     await totalSalea.save();

//     console.log("Total sale saved successfully!");
//     res.status(200).json({ message: "Total sale saved successfully!" });
//   } catch (error) {
//     console.log("Error saving total sale:", error);
//     res.status(500).json({ error: "Failed to save total sale." });
//   }
// });

// app.delete('/users/:id', async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     res.json({ message: 'User deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// app.delete('/user/:id', async (req, res) => {
//   console.log("alert");
//   try {
//     const { id } = req.params;

//     // Find and delete the user
//     const user = await User.findByIdAndDelete(id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Return a success message
//     res.json({ message: 'User deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting user:', error);
//     res.status(500).json({ message: 'Error deleting user', error: error.message });
//   }
// });



// const path = require('path');
// const fs = require('fs');
// const uploadPath = path.join(__dirname, 'uploads');



// const multer = require('multer');
// // Multer setup for file uploading
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadPath); // Save uploaded files in the 'uploads' folder
//   },
//   filename: (req, file, cb) => {
//     const { username } = req.body; // Extract username from request body
//     const ext = path.extname(file.originalname); // Get the file extension
//     const filename = `${username}${ext}`; // Create new filename
//     cb(null, filename); // Set the filename for the uploaded file
//   },
// });
// const upload = multer({ storage });

// // Serve static files from the 'uploads' directory
// app.use('/uploads', express.static(uploadPath));

// // Read JSON data from file
// const readDataFromFile = () => {
//   const data = fs.readFileSync(filePath, 'utf-8');
//   return JSON.parse(data);
// };

// // Write JSON data to file
// const writeDataToFile = (data) => {
//   fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
// };

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });
