const mongoose = require("mongoose");

const DailyTaskSchema = new mongoose.Schema({
  
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  date: {
    type: String, // Format: "YYYY-MM-DD"
    required: true,
  },

  reflectionTask: {
    type: String,
    required: true,
  },

  challengeTask: {
    type: String,
    required: true,
  },

  isReflectionCompleted: {
    type: Boolean,
    default: false,
  },

  isChallengeCompleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("DailyTask", DailyTaskSchema);
