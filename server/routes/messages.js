const express = require('express');
const Message = require('../models/Message');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// SEND A NEW MESSAGE IN A TEAM
router.post('/:teamId', verifyToken, async (req, res) => {
  try {
    const { text } = req.body;
    
    const newMessage = new Message({
      text,
      team: req.params.teamId,
      sender: req.user.userId 
    });
    
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error sending message' });
  }
});

// GET ALL MESSAGES FOR A SPECIFIC TEAM
router.get('/:teamId', verifyToken, async (req, res) => {
  try {
    // We use .populate('sender', 'username email') to replace the sender's ID with their actual username!
    const messages = await Message.find({ team: req.params.teamId })
                                  .populate('sender', 'username email')
                                  .sort({ createdAt: 1 }); // Sort oldest to newest
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching messages' });
  }
});

module.exports = router