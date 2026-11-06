const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['todo', 'in-progress', 'done'], 
    default: 'todo' 
  },
  team: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Team', 
    required: true 
  }, // This links the task to a specific workspace
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);