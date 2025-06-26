const AssignedTask = require('../models/AssignedTask');
const Prompt = require('../models/Prompt');
const moment = require('moment');


// POST: Assign new prompt of each type if not already assigned
const assignDailyTasksToUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const today = moment().format('YYYY-MM-DD');

    // Check if already assigned
    const existing = await AssignedTask.find({ userId, date: today });
    if (existing.length === 2) {
      const populated = await AssignedTask.find({ userId, date: today }).populate('promptId');
      return res.status(200).json({ message: "Tasks already assigned for today", tasks: populated });
    }

    const tasks = [];

    for (let type of ['daily-reflection', 'daily-challenge']) {
      const prompts = await Prompt.find({ type });
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

      const newTask = new AssignedTask({
        userId,
        promptId: randomPrompt._id,
        type,
        date: today
      });

      await newTask.save();
      tasks.push(newTask);
    }

    const populatedTasks = await AssignedTask.find({
      _id: { $in: tasks.map((t) => t._id) }
    }).populate('promptId');

    res.status(201).json({ message: "Tasks assigned", tasks: populatedTasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error assigning tasks" });
  }
};


// GET: Fetch today's tasks
const getTodaysAssignedTasks = async (req, res) => {
  try {
    const today = moment().format('YYYY-MM-DD');
    const userId = req.user.userId;
    
    const tasks = await AssignedTask.find({ userId: req.user.userId, date: today }).populate('promptId');

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching today's tasks" });
  }
};

module.exports = {
  assignDailyTasksToUser,
  getTodaysAssignedTasks
};
