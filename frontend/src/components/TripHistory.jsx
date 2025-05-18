import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  FaPlane, FaMapMarkerAlt, FaCalendarAlt, FaUser, 
  FaSpinner, FaSearch, FaTrash, FaEye, FaInfoCircle 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { auth, onAuthStateChanged } from '../firebase.config';
import { motion } from 'framer-motion';

const TripCard = ({ trip, onDelete, onView }) => {
  // Calculate time since creation
  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    
    return Math.floor(seconds) + " seconds ago";
  };
  
  return (
    <motion.div 
      className="rounded-lg shadow-md overflow-hidden"
      style={{ backgroundColor: '#1a1a1a', borderColor: '#9cadce', borderWidth: '1px' }}
      whileHover={{ boxShadow: '0 0 15px rgba(156, 173, 206, 0.2)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium text-white">
            {trip.source} to {trip.destination}
          </h3>
          <span className="text-xs text-gray-400">{getTimeAgo(trip.createdAt)}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div className="flex items-center text-gray-300">
            <FaCalendarAlt className="mr-2" style={{ color: '#9cadce' }} /> 
            {trip.days} days
          </div>
          <div className="flex items-center text-gray-300">
            <FaUser className="mr-2" style={{ color: '#9cadce' }} /> 
            {trip.travelers} {trip.travelers === 1 ? 'traveler' : 'travelers'}
          </div>
          <div className="flex items-center text-gray-300">
            <FaPlane className="mr-2" style={{ color: '#9cadce' }} /> 
            {trip.itinerary?.flightTime} hours
          </div>
          <div className="flex items-center text-gray-300 capitalize">
            <FaMapMarkerAlt className="mr-2" style={{ color: '#9cadce' }} /> 
            {trip.budget} budget
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <button 
            onClick={() => onView(trip._id)} 
            className="flex items-center justify-center flex-1 py-2 px-3 rounded-md text-black"
            style={{ backgroundColor: '#9cadce' }}
          >
            <FaEye className="mr-1" /> View Trip
          </button>
          <button 
            onClick={() => onDelete(trip._id)} 
            className="flex items-center justify-center py-2 px-3 rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            <FaTrash className="mr-1" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const TripHistory = ({ limit }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchTrips(currentUser.uid);
      } else {
        setTrips([]);
        setLoading(false);
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  const fetchTrips = async (firebaseUID) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/trips/user/${firebaseUID}`
      );
      setTrips(response.data.trips);
      setLoading(false);
      
    } catch (error) {
      console.error('Error fetching trips:', error);
      setError('Failed to load your saved trips');
      setLoading(false);
    }
  };
  
  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) {
      return;
    }
    
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/trips/${tripId}`,
        { data: { firebaseUID: user.uid } }
      );
      // Remove deleted trip from state
      setTrips(trips.filter(trip => trip._id !== tripId));
      
    } catch (error) {
      console.error('Error deleting trip:', error);
      alert('Failed to delete trip. Please try again.');
    }
  };
  
  const handleViewTrip = (tripId) => {
    navigate(`/trip/${tripId}`);
  };
  
  // Filter trips based on search term
  const filteredTrips = trips.filter(trip => 
    trip.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (!user) {
    return (
      <div className="p-6 rounded-lg text-center" style={{ backgroundColor: '#1a1a1a' }}>
        <FaInfoCircle className="text-2xl mx-auto mb-3" style={{ color: '#9cadce' }} />
        <p className="text-white mb-4">Please sign in to view your saved trips</p>
        <Link 
          to="/auth" 
          className="inline-flex items-center px-4 py-2 rounded-md text-black"
          style={{ backgroundColor: '#9cadce' }}
        >
          Sign In or Register
        </Link>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FaSpinner className="animate-spin text-3xl mb-4" style={{ color: '#9cadce' }} />
        <p className="text-white">Loading your trips...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 rounded-md text-red-400 bg-red-900 bg-opacity-30 border border-red-700">
        <p className="flex items-center">
          <FaInfoCircle className="mr-2" /> {error}
        </p>
      </div>
    );
  }
  
  return (
    <div>
      {(!limit) && (
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-2 rounded-lg text-white"
            style={{ backgroundColor: '#1a1a1a', borderColor: '#9cadce', borderWidth: '1px' }}
            placeholder="Search by source or destination"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {filteredTrips.length === 0 ? (
        <div className="text-center py-12">
          <FaPlane className="text-6xl mx-auto mb-4 opacity-30 text-white" />
          <p className="text-xl text-white mb-6">No saved trips found</p>
          <Link 
            to="/itinerary" 
            className="inline-flex items-center px-4 py-2 rounded-md text-black"
            style={{ backgroundColor: '#9cadce' }}
          >
            Create Your First Itinerary
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips
            .slice(0, limit ? limit : filteredTrips.length)
            .map((trip) => (
              <TripCard
                key={trip._id}
                trip={trip}
                onDelete={handleDeleteTrip}
                onView={handleViewTrip}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default TripHistory;
