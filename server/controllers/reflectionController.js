const { get } = require('mongoose');
const Reflection = require('../models/Reflection');
const addPoints = require('../utils/addPoints');


const submitReflection = async(req,res) =>{

    const {text, questId} = req.body;

     const imageUrl = req.file ? req.file.path :null;

    const reflection = await Reflection.create({
        text,
        image: imageUrl,
        questId,
        createdBy: req.user.userId,
    });
    
    await addPoints(req.user.userId, 'reflection', 10, 'Submitted a reflection');

    res.status(201).json({message: 'Reflection submitted', reflection});

}

const submitAudioReflection = async (req, res) => {
  try{
  const { text, questId } = req.body;
  const audioUrl = req.file ? req.file.path : null;

  if (!audioUrl) {
    return res.status(400).json({ message: "Audio file is required." });
  }

  const reflection = await Reflection.create({
    text,
    audio: audioUrl,
    questId,
    createdBy: req.user.userId,
  });

  await addPoints(req.user.userId, 'audio-reflection', 15, 'Submitted an audio reflection');

  res.status(201).json({ message: 'Audio reflection submitted', reflection });
  }catch(error){
    console.error("Audio reflection failed:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


const getQuestReflections = async(req,res) =>{
    const {questId} =req.params;

    const reflections= await Reflection.find({
        questId,
    
        createdBy: req.user.userId,
    });

    res.status(200).json({reflections});
}

module.exports = { submitReflection, submitAudioReflection, getQuestReflections};