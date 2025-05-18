const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');

// Create a new trip
router.post('/', tripController.createTrip);

// Get all trips for a user
router.get('/user/:firebaseUID', tripController.getUserTrips);
router.get('/stats/:firebaseUID', tripController.getTripStats);
// Get a specific trip by ID
router.get('/:tripId', tripController.getTripById);

// Delete a trip
router.delete('/:tripId', tripController.deleteTrip);

module.exports = router;
