const mongoose= require('mongoose');

const RewardSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
    },

    description: String,

    cost: {
    type: Number,
    required: true,
    min: 0,
    },

    isAvailable: {
    type: Boolean,
    default: true,
  },

    type: {
    type: String,
    enum: ['profile-boost', 'exclusive-content','bonus-points', 'prompt', 'gift'],
    required: true,
  }
  
}, { timestamps: true });

module.exports = mongoose.model('Reward', RewardSchema);
