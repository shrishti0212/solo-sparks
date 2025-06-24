const DailyTask = require('../models/DailyTask');

const assignDailyTask = async (req, res) => {
  try {

    const userId = req.user.userId;

    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

    //We check if this user already has a task assigned for today.
    const existing = await DailyTask.findOne({ userId, date: today });
    
    //If a task already exists for today, we just return that task in the response — no need to assign again.
    if (existing) {
      return res.status(200).json({ message: 'Task already assigned', task: existing });
    }

    
    const newTask = await DailyTask.create({
      userId,
      date: today,
      reflectionTask: "What are you holding on to that no longer serves you?",
      challengeTask: "Leave an inspirational post-it for someone who could use it.",
    });

    res.status(201).json({ message: "Today's task assigned", task: newTask });
  } catch (error) {
    console.error('Failed to assign daily task:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {assignDailyTask};