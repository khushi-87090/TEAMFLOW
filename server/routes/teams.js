const express = require('express');
const Team = require('../models/Team');
const verifyToken = require('../middleware/authMiddleware'); // Protects these routes

const router = express.Router();

// CREATE A NEW TEAM
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const newTeam = new Team({
      name,
      description,
      owner: req.user.userId,
      members: [req.user.userId] // The creator automatically becomes the first member
    });
    
    await newTeam.save();
    res.status(201).json(newTeam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating team' });
  }
});

// GET ALL TEAMS FOR THE LOGGED-IN USER
router.get('/', verifyToken, async (req, res) => {
  try {
    // Find any team where this user's ID is in the members array
    const teams = await Team.find({ members: req.user.userId });
    res.status(200).json(teams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching teams' });
  }
});

module.exports = router;