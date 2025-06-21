const UserProfile = require('../models/UserProfile');


const createOrUpdateProfile = async(req,res) =>{
    const {personalityTraits, emotionalNeeds} = req.body;

    try{
        let profile = await UserProfile.findOne({userId: req.user.userId});

       
        if(profile){

            profile.personalityTraits = personalityTraits || profile.personalityTraits;
            profile.emotionalNeeds = emotionalNeeds || profile.emotionalNeeds;
            
            await profile.save();
            
            return res.status(200).json({ message: 'Profile updated', profile });
        }

       
        profile = await UserProfile.create({
            userId: req.user.userId,
            personalityTraits,
            emotionalNeeds
    });

    res.status(201).json({ message: 'Profile created', profile });

  } catch (error) {
    res.status(500).json({ message: 'Failed to save profile', error: error.message });
  }
}

const getUserProfile = async(req,res) =>{
    try{
        const profile = await UserProfile.findOne({userId: req.user.userId});

        if(!profile){
            return res.status(404).json({message: "Profile not found"});
        }

        res.status(200).json({profile});
    }catch(error){
        res.status(500).json({message: "Failed to fetch profile", error: error.message});
    }
}

module.exports = {
  createOrUpdateProfile,
  getUserProfile,
};