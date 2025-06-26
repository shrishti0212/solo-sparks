const express = require('express');
const router = express.Router();
const { addPrompt, getPromptsByType } = require('../controllers/promptController');

// POST: Add a new prompt
router.post('/', addPrompt); // Optional: add authMiddleware if needed

// GET: Get prompts by type (e.g., ?type=daily-challenge)
router.get('/', getPromptsByType);

module.exports = router;
