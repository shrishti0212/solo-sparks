const mongoose = require('mongoose');

const MoodSchema = new mongoose.Schema({
  mood: {
    type: String,
    enum: ['happy', 'sad', 'anxious', 'calm', 'excited', 'tired', 'neutral'],
    required: true,
  },
  note: String,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
}, { timestamps: true });

module.exports = mongoose.model('Mood', MoodSchema);
