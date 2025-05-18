import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaArrowLeft, FaPlane, FaMapMarkerAlt, FaCalendarAlt, 
  FaUser, FaDollarSign, FaTags, FaSpinner, FaClock,
  FaInfoCircle, FaDownload, FaShare, FaCloudSun,
  FaExchangeAlt, FaBed, FaWalking
} from 'react-icons/fa';
import { auth, onAuthStateChanged } from '../firebase.config';
import { motion } from 'framer-motion';

const TripDetail = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  // Get the current user when component loads
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Fetch trip details when user and tripId are available
  useEffect(() => {
    const fetchTripDetails = async () => {
      if (!user || !tripId) {
        return;
      }
      
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/trips/${tripId}`,
          {
            params: { firebaseUID: user.uid }
          }
        );
        
        setTrip(response.data.trip);
        setLoading(false);
        
      } catch (error) {
        console.error('Error fetching trip details:', error);
        setError('Failed to load trip details. You may not have permission to view this trip.');
        setLoading(false);
      }
    };
    
    fetchTripDetails();
  }, [tripId, user]);
  
  // Format date string
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Download itinerary 
  // Replace the downloadItinerary function

const downloadItinerary = () => {
  if (!trip) return;
  
  // Create text content
  let content = `TRAVEL ITINERARY: ${trip.source} to ${trip.destination}\n`;
  content += `Duration: ${trip.days} days | Travelers: ${trip.travelers}\n`;
  content += `Flight Time: ${trip.itinerary.flightTime} hours | Distance: ${trip.itinerary.distance} km\n\n`;
  
  // Add day by day information
  trip.itinerary.days.forEach(day => {
    content += `DAY ${day.day}\n`;
    day.activities.forEach((activity, i) => {
      if (typeof activity === 'object' && activity !== null) {
        content += `${activity.time || 'Time not specified'}: ${activity.description || 'Activity details'}\n`;
      } else {
        content += `Activity ${i+1}: ${activity || 'Activity details'}\n`;
      }
    });
    
    if (day.accommodation) {
      content += `\nAccommodation: ${day.accommodation.name || 'Not specified'} - ${day.accommodation.description || 'No description'}\n\n`;
    } else {
      content += `\nAccommodation: Not specified\n\n`;
    }
  });
  
  // Add travel tips
  if (trip.itinerary.travelTips && trip.itinerary.travelTips.length > 0) {
    content += "TRAVEL TIPS:\n";
    trip.itinerary.travelTips.forEach((tip, i) => {
      content += `- ${tip}\n`;
    });
  }
  
  // Create a blob and trigger download
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${trip.destination}-itinerary.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
  
  // Share itinerary (mock function)
  const shareItinerary = () => {
    alert(`Share feature activated! In a real app, this would open sharing options to email or social media.`);
  };
  
  if (!user) {
    return (
      <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#080808' }}>
        <div className="max-w-4xl mx-auto">
          <div className="p-6 rounded-lg text-center" style={{ backgroundColor: '#1a1a1a' }}>
            <FaInfoCircle className="text-2xl mx-auto mb-3" style={{ color: '#9cadce' }} />
            <p className="text-white mb-4">Please sign in to view this trip</p>
            <button 
              onClick={() => navigate('/auth')}
              className="inline-flex items-center px-4 py-2 rounded-md text-black"
              style={{ backgroundColor: '#9cadce' }}
            >
              Sign In or Register
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#080808' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center py-24">
            <FaSpinner className="animate-spin text-4xl mb-4" style={{ color: '#9cadce' }} />
            <p className="text-white">Loading trip details...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !trip) {
    return (
      <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#080808' }}>
        <div className="max-w-4xl mx-auto">
          <div className="p-6 rounded-lg" style={{ backgroundColor: '#1a1a1a' }}>
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center mb-6 text-white"
            >
              <FaArrowLeft className="mr-2" /> Back to Dashboard
            </button>
            
            <div className="p-4 rounded-md text-red-400 bg-red-900 bg-opacity-30 border border-red-700">
              <p className="flex items-center">
                <FaInfoCircle className="mr-2" /> {error || 'Trip not found or unable to load trip details.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#080808' }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-lg shadow-xl p-6 mb-6"
          style={{ backgroundColor: '#1a1a1a' }}
        >
          {/* Back button and trip date */}
          <div className="flex justify-between mb-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center text-white"
            >
              <FaArrowLeft className="mr-2" /> Back to Dashboard
            </button>
            
            <div className="text-gray-400 text-sm">
              Trip saved on: {formatDate(trip.createdAt)}
            </div>
          </div>
          
          {/* Trip title and actions */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#9cadce' }}>
              {trip.source} to {trip.destination}
            </h1>
            
            <div className="flex space-x-2">
              <motion.button
                onClick={downloadItinerary}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black"
                style={{ backgroundColor: '#9cadce' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaDownload className="mr-2" /> Download
              </motion.button>
              <motion.button
                onClick={shareItinerary}
                className="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm"
                style={{ borderColor: '#9cadce', color: '#9cadce' }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(156, 173, 206, 0.1)' }}
                whileTap={{ scale: 0.95 }}
              >
                <FaShare className="mr-2" /> Share
              </motion.button>
            </div>
          </div>
          
          {/* Trip summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="flex flex-col items-center justify-center p-3 rounded-lg" style={{ backgroundColor: '#252525' }}>
              <FaCalendarAlt className="text-2xl mb-2" style={{ color: '#9cadce' }} />
              <span className="text-gray-400 text-sm">Duration</span>
              <span className="text-white font-medium">{trip.days} Days</span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 rounded-lg" style={{ backgroundColor: '#252525' }}>
              <FaUser className="text-2xl mb-2" style={{ color: '#9cadce' }} />
              <span className="text-gray-400 text-sm">Travelers</span>
              <span className="text-white font-medium">{trip.travelers}</span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 rounded-lg" style={{ backgroundColor: '#252525' }}>
              <FaClock className="text-2xl mb-2" style={{ color: '#9cadce' }} />
              <span className="text-gray-400 text-sm">Flight Time</span>
              <span className="text-white font-medium">{trip.itinerary.flightTime} hours</span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 rounded-lg" style={{ backgroundColor: '#252525' }}>
              <FaDollarSign className="text-2xl mb-2" style={{ color: '#9cadce' }} />
              <span className="text-gray-400 text-sm">Budget</span>
              <span className="text-white font-medium capitalize">{trip.budget}</span>
            </div>
          </div>
          
          {/* Interests */}
          {trip.interests && trip.interests.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-white mb-3">Travel Interests</h3>
              <div className="flex flex-wrap gap-2">
                {trip.interests.map((interest, index) => (
                  <span 
                    key={index}
                    className="inline-block px-3 py-1 rounded-full text-sm"
                    style={{ backgroundColor: '#252525', color: '#9cadce' }}
                  >
                    <FaTags className="inline-block mr-1" /> {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Day by day itinerary */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-white mb-4">Your Itinerary</h3>
            <div className="space-y-6">
              {trip.itinerary.days.map((day, index) => (
                <motion.div
                  key={index}
                  className="rounded-lg overflow-hidden"
                  style={{ backgroundColor: '#252525' }}
                  whileHover={{ boxShadow: '0 0 15px rgba(156, 173, 206, 0.2)' }}
                >
                  <div className="px-4 py-3" style={{ backgroundColor: '#9cadce' }}>
                    <h4 className="font-semibold text-black">Day {day.day}</h4>
                  </div>
                  <div className="p-4">
                    <h5 className="font-medium mb-3" style={{ color: '#9cadce' }}>Activities</h5>
                    <ul className="space-y-3 mb-4">
  {day.activities.map((activity, i) => (
    <li key={i} className="flex items-start">
      <FaWalking className="mt-1 mr-3" style={{ color: '#9cadce' }} />
      {/* Check if activity is an object or string */}
      {typeof activity === 'object' && activity !== null ? (
        <div>
          <span className="text-sm font-medium" style={{ color: '#9cadce' }}>
            {activity.time || 'Time not specified'}:
          </span>{' '}
          <span className="text-gray-300">{activity.description || 'Activity details'}</span>
        </div>
      ) : (
        <span className="text-gray-300">{activity || 'Activity details'}</span>
      )}
    </li>
  ))}
</ul>
                    
                    <h5 className="font-medium mb-2" style={{ color: '#9cadce' }}>Accommodation</h5>
{day.accommodation ? (
  <div className="rounded-lg p-3" style={{ backgroundColor: '#1a1a1a' }}>
    <p className="flex items-center font-medium" style={{ color: '#9cadce' }}>
      <FaBed className="mr-2" /> {day.accommodation.name || 'Accommodation details'}
    </p>
    <p className="text-sm text-gray-400 mt-1">{day.accommodation.description || 'No description available'}</p>
  </div>
) : (
  <div className="rounded-lg p-3" style={{ backgroundColor: '#1a1a1a' }}>
    <p className="text-sm text-gray-400">No accommodation details available</p>
  </div>
)}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Weather Info */}
          {trip.weatherInfo && trip.weatherInfo.destinationWeather && (
            <div className="mb-8">
              <h3 className="flex items-center text-lg font-medium text-white mb-4">
                <FaCloudSun className="mr-2" style={{ color: '#9cadce' }} /> Weather Information
              </h3>
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#252525' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  {/* Source Weather */}
                  {trip.weatherInfo.sourceWeather && (
                    <div className="rounded-lg p-4 bg-gradient-to-br from-blue-900/30 to-indigo-900/30">
                      <h4 className="text-white font-medium mb-2">Weather in {trip.source}</h4>
                      <div className="flex items-center">
                        <div className="mr-4 p-3 rounded-full" style={{ backgroundColor: 'rgba(156, 173, 206, 0.2)' }}>
                          <FaCloudSun className="text-2xl" style={{ color: '#9cadce' }} />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-white">
                            {trip.weatherInfo.sourceWeather.temperature}°C
                          </p>
                          {/* <p className="text-gray-400">
                            {trip.weatherInfo.sourceWeather.condition}
                          </p> */}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Destination Weather */}
                  <div className="rounded-lg p-4 bg-gradient-to-br from-amber-900/30 to-orange-900/30">
                    <h4 className="text-white font-medium mb-2">Weather in {trip.destination}</h4>
                    <div className="flex items-center">
                      <div className="mr-4 p-3 rounded-full" style={{ backgroundColor: 'rgba(251, 191, 36, 0.2)' }}>
                        <FaCloudSun className="text-2xl text-amber-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {trip.weatherInfo.destinationWeather.temperature}°C
                        </p>
                        {/* <p className="text-gray-400">
                          {trip.weatherInfo.destinationWeather.condition}
                        </p> */}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Temperature Difference */}
                {trip.weatherInfo.tempDiff && (
                  <div className="text-center p-3 rounded-lg mb-4" style={{ backgroundColor: '#1a1a1a' }}>
                    <p className="text-gray-400 mb-1">Temperature Difference</p>
                    <p className={`text-2xl font-bold ${
                      parseFloat(trip.weatherInfo.tempDiff) > 0 
                        ? 'text-red-500' 
                        : parseFloat(trip.weatherInfo.tempDiff) < 0 
                          ? 'text-blue-500' 
                          : 'text-white'
                    }`}>
                      {parseFloat(trip.weatherInfo.tempDiff) > 0 ? '+' : ''}{trip.weatherInfo.tempDiff}°C
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Currency Information */}
          {trip.currencyInfo && trip.currencyInfo.currencies && trip.currencyInfo.currencies.length > 0 && (
            <div className="mb-8">
              <h3 className="flex items-center text-lg font-medium text-white mb-4">
                <FaExchangeAlt className="mr-2" style={{ color: '#9cadce' }} /> Currency Information
              </h3>
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#252525' }}>
                <div className="flex flex-wrap gap-3 mb-4">
                  {trip.currencyInfo.currencies.map((currency, index) => (
                    <div 
                      key={index} 
                      className="px-4 py-2 rounded-lg"
                      style={{ backgroundColor: '#1a1a1a' }}
                    >
                      <p className="text-white">{currency.country}</p>
                      <div className="flex items-center mt-1">
                        <span className="font-bold mr-2" style={{ color: '#9cadce' }}>{currency.currencySymbol}</span>
                        <span className="text-gray-400">{currency.currencyCode} - {currency.currencyName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Travel Tips */}
          {trip.itinerary.travelTips && (
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Travel Tips</h3>
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#252525' }}>
                <ul className="space-y-3">
                  {trip.itinerary.travelTips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <FaInfoCircle className="mt-1 mr-3" style={{ color: '#9cadce' }} />
                      <span className="text-gray-300">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TripDetail;
