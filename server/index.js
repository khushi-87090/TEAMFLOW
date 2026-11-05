const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// IMPORT ROUTES
const authRoutes = require('./routes/auth'); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// USE ROUTES
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('TeamFlow Backend is running!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});