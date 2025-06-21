const express = require('express')
const router = express.Router();

const { getUserPoints } = require('../controllers/pointsController')

const authMiddleware = require('../middleware/authMiddleware');

router.get('/',authMiddleware,getUserPoints);

module.exports = router;