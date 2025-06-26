const express = require('express');
const router = express.Router();

const {
  submitReflection,
  getUserReflections,
  updateReflection,
  deleteReflection,
  getReflectionById,
  getReflectionByTaskId
} = require('../controllers/reflectionController');

const authMiddleware = require('../middleware/authMiddleware');
const { uploadImage } = require('../utils/cloudinary');

// POST: Submit a new reflection
router.post(
  '/',
  authMiddleware,
  uploadImage.single('image'),
  submitReflection
);

// GET: Get all reflections of logged-in user with optional ?type=&date=
router.get('/', authMiddleware, getUserReflections);

// GET: Get one reflection by its ID (must belong to the user)
router.get('/:id', authMiddleware, getReflectionById);

// PUT: Update a reflection by ID
router.put('/:id', authMiddleware, uploadImage.single('image'), updateReflection);

//
router.get('/task/:assignedTaskId', authMiddleware, getReflectionByTaskId);

// DELETE: Delete a reflection by ID
router.delete('/:id', authMiddleware, deleteReflection);

module.exports = router;
