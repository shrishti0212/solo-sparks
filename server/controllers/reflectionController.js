const Reflection = require('../models/Reflection');
const AssignedTask = require('../models/AssignedTask');
const addPoints = require('../utils/addPoints');

// -------------------------- Submit Reflection --------------------------
const submitReflection = async (req, res) => {
  try {
    const { type, title, notes, mood } = req.body;
    const imageUrl = req.file ? req.file.path : null;
    const userId = req.user.userId;
    const assignedTaskId = req.body.assignedTaskId || null;

    const validTypes = ['daily-reflection', 'daily-challenge', 'mood', 'journal', 'photo'];
    if (!type || !validTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid or missing reflection type' });
    }

    const today = new Date().toISOString().slice(0, 10);
    let assignedTask = null;
    let points = 0;
    let description = '';

    // Validate assigned task if needed
    if (type === 'daily-reflection' || type === 'daily-challenge') {
      if (!assignedTaskId) {
        return res.status(400).json({ message: 'assignedTaskId is required for task reflections' });
      }

      assignedTask = await AssignedTask.findOne({
        _id: assignedTaskId,
        userId,
        type,
        date: today,
      });

      if (!assignedTask) {
        return res.status(403).json({ message: 'No task assigned for today' });
      }

      const alreadySubmitted = await Reflection.findOne({ userId, assignedTaskId });
      if (alreadySubmitted) {
        return res.status(400).json({ message: 'Task already completed' });
      }

      if (type === 'daily-reflection') {
        points = 15;
        description = 'Completed daily reflection task';
      } else if (type === 'daily-challenge') {
        points = 20;
        description = 'Completed daily challenge task';
      }
    }

    // Mood parsing
    let parsedMood = mood;
    if (typeof mood === 'string') {
      try {
        parsedMood = JSON.parse(mood);
      } catch (err) {
        return res.status(400).json({ message: 'Invalid mood format' });
      }
    }

    // Validation
    if (type === 'daily-reflection' && (!title || !notes)) {
      return res.status(400).json({ message: 'Title and notes are required for daily reflection' });
    }

    if (type === 'daily-challenge' && !imageUrl) {
      return res.status(400).json({ message: 'Image is required for daily challenge' });
    }

    if (type === 'journal' && (!title || !notes)) {
      return res.status(400).json({ message: 'Title and notes are required for journal' });
    }

    if (type === 'mood' && (!parsedMood?.label || !parsedMood?.emoji)) {
      return res.status(400).json({ message: 'Mood data is required for mood reflection' });
    }

    if (type === 'photo' && !imageUrl) {
      return res.status(400).json({ message: 'Image is required for photo reflection' });
    }

    // Create reflection
    const reflection = await Reflection.create({
      userId,
      type,
      title: title || '',
      notes: notes || '',
      mood: parsedMood,
      image: imageUrl,
      assignedTaskId,
    });

    if (points > 0) {
      await addPoints(userId, type, points, description);
    }

    res.status(201).json({
      message: `${type} reflection submitted successfully`,
      reflection,
      pointsEarned: points,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


// -------------------------- Get All Reflections --------------------------
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


// -------------------------- Update Reflection --------------------------
const updateReflection = async (req, res) => {
  try {
    const reflectionId = req.params.id;
    const userId = req.user.userId;
    const { title, notes } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    let mood = req.body.mood;
    if (typeof mood === 'string') {
      try {
        mood = JSON.parse(mood);
      } catch (e) {
        return res.status(400).json({ message: 'Invalid mood format' });
      }
    }

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


// -------------------------- Delete Reflection --------------------------
const deleteReflection = async (req, res) => {
  try {
    const reflection = await Reflection.findById(req.params.id);

    if (!reflection) {
      console.log('Reflection not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Reflection not found' });
    }

    // ✅ FIXED: Correct user ownership check
    if (String(reflection.userId) !== String(req.user.userId)) {
      console.log('User not authorized to delete this reflection.');
      return res.status(403).json({ message: 'Not allowed to delete' });
    }

    await reflection.deleteOne();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Error deleting reflection:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// -------------------------- Get Reflection by ID --------------------------
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


// -------------------------- Get Reflection by Assigned Task ID --------------------------
const getReflectionByTaskId = async (req, res) => {
  try {
    const reflection = await Reflection.findOne({
      assignedTaskId: req.params.assignedTaskId,
      userId: req.user.userId,
    });

    if (!reflection) {
      return res.status(404).json({ message: 'No reflection found for this task' });
    }

    res.json(reflection);
  } catch (err) {
    console.error('Error fetching reflection by task ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  submitReflection,
  getUserReflections,
  updateReflection,
  deleteReflection,
  getReflectionById,
  getReflectionByTaskId,
};
