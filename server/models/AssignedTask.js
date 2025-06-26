const mongoose = require('mongoose');

const assignedTaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  type: {
    type: String,
    enum: ['daily-reflection', 'daily-challenge'],
    required: true,
  },

  promptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prompt',
    required: true,
  },

  date: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('AssignedTask', assignedTaskSchema);
