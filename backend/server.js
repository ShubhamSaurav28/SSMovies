const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware setup
app.use(cors());  // Enable CORS for all origins
app.use(express.json());  // To parse incoming JSON requests

// Use the routes
app.use('/api/auth', authRoutes);  // Auth routes
app.use('/api/movies', movieRoutes);  // Movie routes

// Set the port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
