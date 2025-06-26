const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  assignDailyTasksToUser,
  getTodaysAssignedTasks
} = require('../controllers/assignedTaskController');

// Assign today's prompts to user if not already assigned
router.post('/assign', authMiddleware, assignDailyTasksToUser);

// Get today's assigned tasks (challenge + reflection)
router.get('/today', authMiddleware, getTodaysAssignedTasks);

module.exports = router;
