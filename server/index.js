const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // The new bridge for your React frontend
require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors()); // Must be before routes!
app.use(express.json()); // Allows your server to read the JSON data from React

// Routes
// We prefix the auth routes with '/api/auth' to match what your frontend is calling
app.use('/api/auth', authRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});