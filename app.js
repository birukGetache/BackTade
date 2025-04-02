require('dotenv').config({ path: './config/.env' });
const express = require('express');
const connectDB = require('./config/db');
const admin = require("./routes/AdminRout.js")
const casher = require("./routes/casherRout.js");
const client = require("./routes/ClientRout.js")
const contact = require("./routes/contactRout.js")
const cosmo = require("./routes/CosmoRout.js") 
const customer = require('./routes/customerPermanentRout.js')
const customerCount = require('./routes/customerRout.js')
const medicineGroup = require("./routes/medicineGroupRout.js")
const medicine = require('./routes/medicineRout.js')
const Sales = require('./routes/salesRout.js')
const Supplier = require('./routes/SupplierRout.js')
const transaction = require('./routes/transactionRout.js')
const corsMiddleware = require('./middleware/cors');
const refreshToken = require('./routes/AuthRout.js')
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT ;

app.use(corsMiddleware); 

app.use(express.json()); 

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api/admin', admin);   
app.use('/api/casher', casher);   
app.use('/api/client', client);   
app.use('/api/contact', contact);   
app.use('/api/cosmo', cosmo);   
app.use('/api/customer', customer);   
app.use('/api/customerCount', customerCount);   
app.use('/api/medicineGroup', medicineGroup);   
app.use('/api/medicine', medicine);   
app.use('/api/Sales', Sales);   
app.use('/api/Supplier', Supplier);   
app.use('/api/transaction', transaction);   
app.use('/api/auth' , refreshToken)
connectDB()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on http://0.0.0.0:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed', err);
    process.exit(1); 
  });