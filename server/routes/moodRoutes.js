const express = require('express');
const router = express.Router();

const {submitMood,getUserMoods} = require('../controllers/moodController')

const authMiddleware = require('../middleware/authMiddleware');


router.post('/', authMiddleware, submitMood);
router.get('/', authMiddleware, getUserMoods);

module.exports = router;