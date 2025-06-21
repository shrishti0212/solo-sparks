const Mood = require('../models/Mood');
const UserProfile =require('../models/UserProfile');
const addPoints = require('../utils/addPoints');

const submitMood = async (req, res) =>{

    try{
    const{mood, note, questId} = req.body;

    const moodEntry = await Mood.create({
        mood,
        note,
        questId,
        createdBy:req.user.userId,
    });

    
    let profile = await UserProfile.findOne({userId: req.user.userId})

    if(profile){
        profile.moodPatterns.push({mood, timestamp: new Date()});
        await profile.save();
    }

 
    await addPoints(req.user.userId ,'mood',5 , 'Logged a mood');

        res.status(201).json({ message: 'Mood submitted',moodEntry});
    }catch(error){
        res.status(500).json({message: 'Failed to submit mood', error:error.message})
}
};

const getUserMoods = async (req,res) =>{
    const moods = await Mood.find({ createdBy: req.user.userId });
    res.status(200).json({moods});
}

module.exports = { submitMood, getUserMoods};