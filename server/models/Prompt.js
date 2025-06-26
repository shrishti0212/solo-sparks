const mongoose = require("mongoose");

const PromptSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["daily-reflection", "daily-challenge"],
    required: true,
  },

  title: {
    type: String,
    required: true,
    trim: true,
  },

  content: {
    type: String,
    required: true,
    trim: true,
  },

  rewardPoints: {
    type: Number,
    default: 10,
  },
}, { timestamps: true });

module.exports = mongoose.model("Prompt", PromptSchema);
