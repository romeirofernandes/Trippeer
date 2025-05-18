const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Register or login a user
router.post('/auth', userController.registerOrLogin);

// Get user profile
router.get('/profile/:firebaseUID', userController.getUserProfile);

module.exports = router;
