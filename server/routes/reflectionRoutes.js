const express = require('express')
const router = express.Router();

const{submitReflection,
    submitAudioReflection,
    getQuestReflections
}=require('../controllers/reflectionController');

const authMiddleware =  require('../middleware/authMiddleware');
const{uploadImage,uploadVideo} = require('../utils/cloudinary');


router.post('/text',authMiddleware, uploadImage.single('image') , submitReflection);


router.post('/audio', authMiddleware, uploadVideo.single('audio'), submitAudioReflection);


router.get('/:questId',authMiddleware,getQuestReflections);

module.exports = router;
