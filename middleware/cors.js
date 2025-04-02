require('dotenv').config(); // Ensure .env is loaded

const cors = require('cors');

console.log('Allowed Origin:', process.env.CLIENT_URL); // Debugging

const corsOptions = {
  origin: process.env.CLIENT_URL, // Fallback if env variable is missing
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies
};

const corsMiddleware = cors(corsOptions);
module.exports = corsMiddleware;
