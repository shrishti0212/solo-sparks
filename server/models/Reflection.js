const mongoose = require("mongoose");

const ReflectionSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  type: {
    type: String,
    enum: ["daily-reflection", "daily-challenge", "mood", "journal","photo"],
    required: true,
  },
  
  title: String,

  notes: String,

  mood: {
    emoji: String,
    label: String,
  },

  image: String,

  rewardPoints: {
    type: Number,
    default: 0,
  },

}, { timestamps: true });

module.exports = mongoose.model("Reflection", ReflectionSchema);
