// At the top of the file, make sure you have this (adjust path if needed):
// const User = require('../models/User');
// const Team = require('../models/Team');

// NEW: Invite a user to a team by email
router.post('/:teamId/invite', async (req, res) => {
  try {
    const { email } = req.body;
    
    // 1. Find the user by their email
    const userToInvite = await User.findOne({ email });
    if (!userToInvite) {
      return res.status(404).json({ message: 'User not found in TeamFlow. Make sure they are registered!' });
    }

    // 2. Add them to the team's members list (using $addToSet to prevent duplicates)
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