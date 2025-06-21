const Quest = require('../models/Quest');
const addPoints = require('../utils/addPoints');


const createQuest = async(req,res)=>{
    const{ title, description,type} = req.body;

    const quest = await Quest.create({
        title,
        description,
        type,
        createdBy: req.user.userId,
    });

    res.status(201).json({message: 'Quest created',quest});
};


const getUserQuests =  async(req,res) =>{
    const quests = await Quest.find({createdBy: req.user.userId});
    res.status(200).json({quests});
};

const updateQuest = async(req,res)=>{
    const{id:questId} = req.params;
    const{ title, description, status} = req.body;

    const quest =  await Quest.findOne(
        {_id: questId, createdBy: req.user.userId},
    )

    if(!quest){
        return res.status(404).json({msg: 'Quest not found or unauthorized'});
    }

    const wasAlreadyDone = quest.status === 'done';

    if(title) quest.title = title;
    if(description) quest.description = description;
    if(status) quest.status = status;

    await quest.save();

    if (!wasAlreadyDone && status === 'done') {
      await addPoints(req.user.userId, 'quest-completion', 20, 'Completed a quest');
        
      const UserProfile = require('../models/UserProfile');
      const profile = await UserProfile.findOne({userId: req.user.userId});

      if(profile && quest.type && !profile.pastQuestTypes.includes(quest.type)){
        profile.pastQuestTypes.push(quest.type);
        await profile.save();
      }
    
    }

    res.status(200).json({message: 'Quest updated', quest});
} 



const deleteQuest = async(req,res) =>{
    const{ id: questId} = req.params;

    const quest = await Quest.findOneAndDelete({
        _id: questId,
        createdBy: req.user.userId,
    });

    if(!quest){
        return res.status(404).json({msg: 'Quest not found or unauthorized'});
    }

    res.status(200).json({message: 'Quest deleted succesfully'});
}


module.exports = {
    createQuest,
    getUserQuests,
    updateQuest,
    deleteQuest
};