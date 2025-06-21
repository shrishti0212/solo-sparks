const express = require('express');
const router = express.Router();

const {createOrUpdateProfile, getUserProfile} = require('../controllers/userProfileController');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/',authMiddleware,createOrUpdateProfile);
router.get('/',authMiddleware,getUserProfile)

module.exports = router;