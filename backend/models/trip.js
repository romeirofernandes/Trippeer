const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  firebaseUID: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  days: {
    type: Number,
    required: true,
  },
  travelers: {
    type: Number,
    required: true,
  },
  budget: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high'],
  },
  interests: {
    type: [String],
    default: [],
  },
  itinerary: {
    flightTime: Number,
    distance: Number,
    days: [
      {
        day: Number,
        activities: [String],
        accommodation: {
          name: String,
          description: String,
        },
      },
    ],
    travelTips: [String],
  },
  weatherInfo: {
    sourceWeather: {
      temperature: Number,
      condition: String,
      humidity: Number,
      windSpeed: Number,
    },
    destinationWeather: {
      temperature: Number,
      condition: String,
      humidity: Number,
      windSpeed: Number,
      forecast: [
        {
          date: String,
          maxTemp: Number,
          minTemp: Number,
          condition: String,
          chanceOfRain: Number,
        },
      ],
    },
    tempDiff: Number,
  },
  currencyInfo: {
    sourceInfo: {
      code: String,
      name: String,
      symbol: String,
      country: String,
    },
    destinationInfo: {
      code: String,
      name: String,
      symbol: String,
      country: String,
    },
    exchangeRate: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Trip', tripSchema);
