const Reward = require('../models/Rewards');
const SparkPoints = require('../models/SparkPoints');
const UserProfile =require('../models/UserProfile');
const addPoints = require('../utils/addPoints');

//create a new reward 
const createReward = async(req,res) =>{

    const {title, description, cost, type} = req.body;

    try{
        const reward = await Reward.create({
            title,
            description,
            cost,
            type,
        });
    
    res.status(201).json({message: 'Reward created', reward});
    } catch(error){
        res.status(500).json({message: 'failed to create reward', error: error.message});
    }

}

//get all available reward 
const getAvailableRewards = async(req,res) =>{
    try{
        const reward = await Reward.find({ isAvailable:true})

        res.status(200).json({reward});
    }catch(error){
        res.status(500).json({message:' failed to fetch rewards', error: error.message})
    }
}

//redeem reward
const redeemReward = async(req,res) =>{

    const{rewardId} = req.params;
    const userId = req.user.userId;

    const reward = await Reward.findById(rewardId);

    if(!reward){
        return res.status(404).json({message:'Reward not found'});
    }

    const userPoints = await SparkPoints.findOne({userId});
    if(!userPoints || userPoints.totalPoints < reward.cost){
        return res.status(400).json({message:'Not enough spark points'})
    }

    userPoints.totalPoints -= reward.cost;
    userPoints.history.push({
        type:'redemption',
        points: -reward.cost,
        description:`Redeemed reward: ${reward.title || reward.type}`
    })
    await userPoints.save();

    if(reward.type === 'profile-boost'){
        const profile = await UserProfile.findOne({userId});
        if(profile){
            profile.profileBoosted =true
            await profile.save();
        }
    }

    if(reward.type === 'bonus-points'){
        await addPoints(userId , 'bonus' ,10, 'Received bonus points reward');
    }

    res.status(200).json({
        message:'Reward redeemed Succesfully',
        reward:{
            name:reward.name,
            type: reward.type,
            benefit: reward.benefit,
        }
    })
}


module.exports={createReward,
    getAvailableRewards,
    redeemReward,
};