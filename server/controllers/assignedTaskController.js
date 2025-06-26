const AssignedTask = require('../models/AssignedTask');
const Prompt = require('../models/Prompt');
const moment = require('moment');


// POST: Assign new prompt of each type if not already assigned
const assignDailyTasksToUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const today = moment().format('YYYY-MM-DD');
    const assignedTasks = [];

    for (let type of ['daily-reflection', 'daily-challenge']) {
      const existingTask = await AssignedTask.findOne({ userId, type, date: today });

      if (!existingTask) {
        const prompts = await Prompt.find({ type });
        if (prompts.length === 0) {
          continue; // skip if no prompts exist
        }

        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

        const newTask = await AssignedTask.create({
          userId,
          promptId: randomPrompt._id,
          type,
          date: today
        });

        assignedTasks.push(newTask);
      } else {
        assignedTasks.push(existingTask); // include existing for response
      }
    }

    // Always return populated tasks for today
    const populatedTasks = await AssignedTask.find({
      userId,
      date: today
    }).populate('promptId');

    return res.status(200).json({
      message: "Today's tasks ready",
      tasks: populatedTasks
    });

  } catch (err) {
    console.error("Error assigning tasks:", err);
    return res.status(500).json({ message: "Internal server error" });
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
