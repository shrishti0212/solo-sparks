const express= require('express');
const router = express.Router();

const {createReward,getAvailableRewards, redeemReward} = require('../controllers/rewardController')
const authMiddleware = require('../middleware/authMiddleware')


router.get('/',authMiddleware,getAvailableRewards);

router.post('/',authMiddleware, createReward);

router.post('/redeem/:rewardId', authMiddleware, redeemReward);

module.exports = router;