const express = require('express');
const Task = require('../models/Task');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// CREATE A NEW TASK FOR A SPECIFIC TEAM
router.post('/:teamId', verifyToken, async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;
    
    const newTask = new Task({
      title,
      description,
      team: req.params.teamId, // Grabs the team ID from the URL
      assignedTo: assignedTo || null // Optional assignment
    });
    
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating task' });
  }
});

// GET ALL TASKS FOR A SPECIFIC TEAM
router.get('/:teamId', verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ team: req.params.teamId });
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
});

module.exports = router;