const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // The bridge for your React frontend
require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/auth');
const teamRoutes = require('./routes/teams'); // 1. Added Team routes import

const app = express();

// Middleware
app.use(cors()); // Must be before routes!
app.use(express.json()); // Allows your server to read the JSON data from React

// Routes
// We prefix the routes to match what your frontend will call
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes); // 2. Added Team routes usage

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});