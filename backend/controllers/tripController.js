const Trip = require('../models/trip');

// Create a new trip
exports.createTrip = async (req, res) => {
  try {
    const {
      firebaseUID,
      source,
      destination,
      days,
      travelers,
      budget,
      interests,
      itinerary,
      weatherInfo,
      currencyInfo
    } = req.body;

    if (!firebaseUID) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const newTrip = new Trip({
      firebaseUID,
      source,
      destination,
      days,
      travelers,
      budget,
      interests,
      itinerary,
      weatherInfo,
      currencyInfo
    });

    const savedTrip = await newTrip.save();

    return res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      trip: savedTrip
    });
  } catch (error) {
    console.error('Error creating trip:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.getTripStats = async (req, res) => {
  try {
    const { firebaseUID } = req.params;
    if (!firebaseUID) {
      return res.status(400).json({ error: "Missing firebaseUID" });
    }
    const trips = await Trip.find({ firebaseUID });

    // Example stats calculation
    const total = trips.length;
    const upcoming = trips.filter(trip => /* add your logic for upcoming */ true).length;
    const countries = new Set(trips.map(trip => trip.destination)).size;
    const distance = trips.reduce((sum, trip) => sum + (trip.itinerary?.distance || 0), 0);

    res.json({ total, upcoming, countries, distance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get all trips for a user
exports.getUserTrips = async (req, res) => {
  try {
    const { firebaseUID } = req.params;
    
    if (!firebaseUID) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const trips = await Trip.find({ firebaseUID })
      .sort({ createdAt: -1 }) // Sort by newest first
      .select('-__v'); // Exclude the __v field

    return res.status(200).json({
      success: true,
      count: trips.length,
      trips
    });
  } catch (error) {
    console.error('Error fetching user trips:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get a specific trip by ID
exports.getTripById = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { firebaseUID } = req.query;
    
    if (!firebaseUID) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const trip = await Trip.findOne({ _id: tripId, firebaseUID });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found or not authorized to view'
      });
    }

    return res.status(200).json({
      success: true,
      trip
    });
  } catch (error) {
    console.error('Error fetching trip details:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete a trip
exports.deleteTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { firebaseUID } = req.body;
    
    if (!firebaseUID) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const trip = await Trip.findOne({ _id: tripId, firebaseUID });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found or not authorized to delete'
      });
    }

    await Trip.findByIdAndDelete(tripId);

    return res.status(200).json({
      success: true,
      message: 'Trip deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting trip:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
