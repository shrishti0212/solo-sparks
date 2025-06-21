const express= require('express');
const router = express.Router();

const {getMySparkPoints} = require('../controllers/sparkPointsController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:userId',authMiddleware,getMySparkPoints);

module.exports = router;