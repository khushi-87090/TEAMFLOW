const express = require('express');
const router = express.Router();

// Import your Task model (make sure this path matches your folder structure)
const Task = require('../models/Task'); 

// 1. GET all tasks for a specific team
// Route: GET /api/tasks/:teamId
router.get('/:teamId', async (req, res) => {
  try {
    // Find all tasks that belong to this specific team
    const tasks = await Task.find({ team: req.params.teamId });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// 2. POST a new task to a specific team
// Route: POST /api/tasks/:teamId
router.post('/:teamId', async (req, res) => {
  try {
    const { title, description } = req.body;
    
    const newTask = new Task({
      title,
      description,
      status: 'todo', // Every new task starts as 'todo'
      team: req.params.teamId
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// 3. PUT (update) a task's status
// Route: PUT /api/tasks/:taskId
router.put('/:taskId', async (req, res) => {
  try {
    const { status } = req.body;
    
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      { status },
      { new: true } // Returns the newly updated task document
    );

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// 4. DELETE a task
// Route: DELETE /api/tasks/:taskId
router.delete('/:taskId', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.taskId);
    
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({ message: 'Task successfully deleted' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;