const mongoose = require('mongoose');


const QuestSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, "Please provide a title"],
    },

    description:{
        type:String,
    },
    
    type:{
        type: String,
        required: true,
        enum: ['self-care', 'adventure', 'mindfulness', 'creativity', 'reflection'],
        default:'journal'
    },

    status:{
        type:String,
        enum:['pending','done'],
        default:'pending',
    },

    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required: true,
    },
    },{timestamps: true}
);

module.exports =mongoose.model('Quest', QuestSchema);