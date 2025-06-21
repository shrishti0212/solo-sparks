// models/SparkPoints.js
const mongoose = require('mongoose');

const SparkPointsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  totalPoints: {
    type: Number,
    default: 0,
  },
  history: [
    {
      type: {
        type: String,
        enum: ['quest', 'reflection','video-reflection', 'audio-reflection', 'mood', 'bonus','redemption'],
        required: true,
      },
      points: {
        type: Number,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      description: String,
    },
  ],
});

module.exports = mongoose.model('SparkPoints', SparkPointsSchema);

