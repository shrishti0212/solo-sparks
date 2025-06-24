const express=require('express')
const router = express.Router();
const { assignDailyTask} = require('../controllers/dailyTaskController')

const authMiddleware = require('../middleware/authMiddleware')

router.get('/today',authMiddleware,assignDailyTask);

module.exports =router;