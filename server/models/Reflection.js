// models/Reflection.js
const mongoose = require('mongoose');

const ReflectionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please provide your reflection'],
  },
  image: {
    type: String,
  },
  audio: {   
    type: String,
  },
  questId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quest',
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });


module.exports = mongoose.model('Reflection', ReflectionSchema);
