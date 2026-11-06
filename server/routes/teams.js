const express = require('express');
const router = express.Router();

// Import models
const Team = require('../models/Team');
const User = require('../models/User');

// GET all teams for the logged-in user
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find(); 
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

// POST to create a new team
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const newTeam = new Team({ name });
    const savedTeam = await newTeam.save();
    res.status(201).json(savedTeam);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create team' });
  }
});

// POST to invite a user to a team
router.post('/:teamId/invite', async (req, res) => {
  try {
    const { email } = req.body;
    
    // 1. Find the user by their email
    const userToInvite = await User.findOne({ email });
    if (!userToInvite) {
      return res.status(404).json({ error: 'User not found in TeamFlow. Make sure they are registered!' });
    }

    // 2. Add them to the team's members list
    await Team.findByIdAndUpdate(
      req.params.teamId, 
      { $addToSet: { members: userToInvite._id } }
    );

    res.json({ message: `${userToInvite.username} has been added to the team!` });
  } catch (error) {
    console.error('Error inviting user:', error);
    res.status(500).json({ error: 'Failed to invite user' });
  }
});

module.exports = router;