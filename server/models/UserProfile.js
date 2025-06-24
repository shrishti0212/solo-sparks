const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },

  personalityTraits: {
    type: [String],
    default: [],
  },

  emotionalNeeds: {
    type: [String],
    default: [],
  },

  
  moodPatterns: [
    {
      mood: {
        type: String,
        enum: ['happy', 'sad', 'anxious', 'calm', 'excited', 'tired', 'neutral'],
        required: true,
      },

      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  profileBoosted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', UserProfileSchema);
