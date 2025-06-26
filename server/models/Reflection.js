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
  
  title: { type: String, trim: true },

  notes: { type: String, trim: true },

  mood: {
    emoji: String,
    label: String,
  },

  image: { type: String, trim: true },

  rewardPoints: {
    type: Number,
    default: 0,
  },

  assignedTaskId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'AssignedTask'
}


}, { timestamps: true });

module.exports = mongoose.model("Reflection", ReflectionSchema);
