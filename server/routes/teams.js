const express = require('express');
const router = express.Router();

// Import models & authentication middleware
const Team = require('../models/Team');
const User = require('../models/User');
const verifyToken = require('../middleware/authMiddleware');

// GET all teams for the logged-in user (Protected)
router.get('/', verifyToken, async (req, res) => {
  try {
    // Find teams where the user is either the owner or a member
    const teams = await Team.find({
      $or: [
        { owner: req.user.userId },
        { members: req.user.userId }
      ]
    }); 
    res.json(teams);
  } catch (error) {
    console.error('Fetch Teams Error:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

// POST to create a new team (Protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Team name is required' });
    }

    const newTeam = new Team({ 
      name, 
      owner: req.user.userId,
      members: [req.user.userId] // Automatically add creator as a member
    });

    const savedTeam = await newTeam.save();
    res.status(201).json(savedTeam);
  } catch (error) {
    console.error('Create Team Error:', error);
    res.status(500).json({ error: 'Failed to create team', details: error.message });
  }
});

// POST to invite a user to a team (Protected)
router.post('/:teamId/invite', verifyToken, async (req, res) => {
  try {
    const { email } = req.body;
    
    // 1. Find the user by their email
    const userToInvite = await User.findOne({ email });
    if (!userToInvite) {
      return res.status(404).json({ error: 'User not found in TeamFlow. Make sure they are registered!' });
    }

    // 2. Add them to the team's members list
    const updatedTeam = await Team.findByIdAndUpdate(
      req.params.teamId, 
      { $addToSet: { members: userToInvite._id } },
      { new: true }
    );

    if (!updatedTeam) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json({ message: `${userToInvite.name || userToInvite.email} has been added to the team!` });
  } catch (error) {
    console.error('Error inviting user:', error);
    res.status(500).json({ error: 'Failed to invite user' });
  }
});

module.exports = router;