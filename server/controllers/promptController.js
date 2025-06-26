const Prompt = require('../models/Prompt');

const validTypes = ['daily-reflection', 'daily-challenge'];

// Add a new prompt
const addPrompt = async (req, res) => {
  try {
    const { type, title, content } = req.body;

    if (!type || !title || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid prompt type" });
    }

    const newPrompt = new Prompt({ type, title, content });
    await newPrompt.save();
    res.status(201).json({ message: "Prompt added", prompt: newPrompt });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all prompts of a given type
const getPromptsByType = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};

    const prompts = await Prompt.find(filter);
    res.status(200).json(prompts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addPrompt, getPromptsByType };
