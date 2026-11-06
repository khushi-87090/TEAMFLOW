const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: { 
    type: String, 
    required: true 
  },
  team: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Team', 
    required: true 
  }, // Which workspace does this message belong to?
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  } // Who sent it?
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);