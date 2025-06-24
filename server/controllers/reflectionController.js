const Reflection = require('../models/Reflection');
const DailyTask = require('../models/DailyTask');
const addPoints = require('../utils/addPoints');

const submitReflection = async (req, res) => {
  try {
    const { type, title, notes, mood } = req.body;
    const imageUrl = req.file ? req.file.path : null;
    const userId = req.user.userId;

    const validTypes = ['daily-reflection', 'daily-challenge', 'mood', 'journal', 'photo'];
    if (!type || !validTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid or missing reflection type' });
    }

    const today = new Date().toISOString().slice(0, 10);
    
    let task = null;
    if (type === 'daily-reflection' || type === 'daily-challenge') {
      task = await DailyTask.findOne({ userId, date: today });
    if (!task) {
      return res.status(403).json({ message: 'No task assigned for today' });
  }
}


    const reflection = await Reflection.create({
      userId,
      type,
      title,
      notes,
      mood,
      image: imageUrl,
    });

    let points = 0;
    let description = '';

    if (type === 'daily-reflection' && !task.isReflectionCompleted) {
      points = 15;
      description = 'Completed daily reflection task';
      task.isReflectionCompleted = true;
    }

    if (type === 'daily-challenge' && !task.isChallengeCompleted) {
      points = 20;
      description = 'Completed daily challenge task';
      task.isChallengeCompleted = true;
    }

    if (points > 0) {
      await task.save();
      await addPoints(userId, type, points, description);
    }

    if (type === 'photo' && !imageUrl) {
      return res.status(400).json({ message: 'Photo reflection must include an image' });
    }

    res.status(201).json({
      message: `${type} reflection submitted`,
      reflection,
      pointsEarned: points,
      taskUpdated: !!points,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const getUserReflections = async (req, res) => {
  try {
    const { type, date } = req.query;
    const userId = req.user.userId;

    const query = { userId };
    if (type) query.type = type;
    if (date) {
      const dayStart = new Date(date);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: dayStart, $lte: dayEnd };
    }

    const reflections = await Reflection.find(query).sort({ createdAt: -1 });
    res.status(200).json({ reflections });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const updateReflection = async (req, res) => {
  try {
    const reflectionId = req.params.id;
    const userId = req.user.userId;
    const { title, notes, mood } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    const reflection = await Reflection.findById(reflectionId);
    if (!reflection) {
      return res.status(404).json({ message: 'Reflection not found' });
    }

    if (reflection.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this reflection' });
    }

    if (title) reflection.title = title;
    if (notes) reflection.notes = notes;
    if (mood) reflection.mood = mood;
    if (imageUrl) reflection.image = imageUrl;

    await reflection.save();
    res.status(200).json({ message: 'Reflection updated successfully', reflection });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const deleteReflection = async (req, res) => {
  try {
    const reflectionId = req.params.id;
    const userId = req.user.userId;

    const reflection = await Reflection.findById(reflectionId);
    if (!reflection) {
      return res.status(404).json({ message: 'Reflection not found' });
    }

    if (reflection.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this reflection' });
    }

    await Reflection.findByIdAndDelete(reflectionId);
    res.status(200).json({ message: 'Reflection deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const getReflectionById = async (req, res) => {
  try {
    const reflectionId = req.params.id;
    const userId = req.user.userId;

    const reflection = await Reflection.findById(reflectionId);
    if (!reflection) {
      return res.status(404).json({ message: 'Reflection not found' });
    }

    if (reflection.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to access this reflection' });
    }

    res.status(200).json(reflection);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = {
  submitReflection,
  getUserReflections,
  updateReflection,
  deleteReflection,
  getReflectionById
};
