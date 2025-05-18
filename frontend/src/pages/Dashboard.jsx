import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlane, FaMapMarkerAlt, FaCalendarAlt, FaHistory, FaRoute, FaCompass, FaChevronLeft, FaChevronRight, FaExternalLinkAlt } from 'react-icons/fa';
import Sidebar, { SidebarProvider, useSidebar } from '../components/Sidebar';
import TripHistory from '../components/TripHistory';
import { Link } from 'react-router-dom';
import { auth, onAuthStateChanged } from '../firebase.config';
import axios from 'axios';

// Popular destinations data with images
const popularDestinations = [
  {
    id: 1,
    name: "Paris, France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop",
    description: "Known as the city of love, Paris offers iconic landmarks like the Eiffel Tower and world-class cuisine."
  },
  {
    id: 2,
    name: "Kyoto, Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop",
    description: "Experience traditional Japanese culture with stunning temples, bamboo forests and beautiful cherry blossoms."
  },
  {
    id: 3,
    name: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1000&auto=format&fit=crop",
    description: "Famous for its stunning white buildings, blue domes, and breathtaking sunsets over the Aegean Sea."
  },
  {
    id: 4,
    name: "New York City, USA",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1000&auto=format&fit=crop",
    description: "The city that never sleeps offers incredible skyscrapers, Broadway shows, and diverse neighborhoods."
  },
  {
    id: 5,
    name: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop",
    description: "A tropical paradise with beautiful beaches, rice terraces, and a unique spiritual atmosphere."
  }
];

const DashboardContent = () => {
  const { isOpen } = useSidebar();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tripStats, setTripStats] = useState({
    total: 0,
    upcoming: 0,
    countries: 0,
    distance: 0
  });
  const [activeDestination, setActiveDestination] = useState(0);

  // Get user and load trip statistics
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          // Fetch trip statistics
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/trips/stats/${currentUser.uid}`
          );
          setTripStats(response.data || {
            total: 0,
            upcoming: 0,
            countries: 0,
            distance: 0
          });
        } catch (err) {
          console.error("Error fetching trip stats:", err);
        }
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Handle carousel navigation
  const nextDestination = () => {
    setActiveDestination((prev) => (prev + 1) % popularDestinations.length);
  };

  const prevDestination = () => {
    setActiveDestination((prev) => (prev - 1 + popularDestinations.length) % popularDestinations.length);
  };

  return (
    <div className="flex min-h-screen bg-[#080808]">
      <Sidebar />
      <motion.main
        initial={{ marginLeft: "64px" }}
        animate={{
          marginLeft: isOpen ? "240px" : "64px",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-1 p-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-[#f8f8f8]">Dashboard</h1>
              {user && (
                <div className="text-sm text-[#9cadce]">
                  Welcome back, {user.displayName || user.email.split('@')[0]}
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="text-xl font-semibold mb-4 text-[#f8f8f8]">Your Travel Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#111111] border border-[#232323] rounded-lg p-4 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-indigo-900/30 flex items-center justify-center mb-3">
                  <FaRoute className="text-2xl text-[#9cadce]" />
                </div>
                <span className="text-3xl font-bold text-[#f8f8f8]">{tripStats.total}</span>
                <span className="text-sm text-[#9cadce]">Total Trips</span>
              </div>
              
              <div className="bg-[#111111] border border-[#232323] rounded-lg p-4 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center mb-3">
                  <FaCalendarAlt className="text-2xl text-green-400" />
                </div>
                <span className="text-3xl font-bold text-[#f8f8f8]">{tripStats.upcoming}</span>
                <span className="text-sm text-[#9cadce]">Upcoming Trips</span>
              </div>
              
              <div className="bg-[#111111] border border-[#232323] rounded-lg p-4 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-amber-900/30 flex items-center justify-center mb-3">
                  <FaMapMarkerAlt className="text-2xl text-amber-400" />
                </div>
                <span className="text-3xl font-bold text-[#f8f8f8]">{tripStats.countries}</span>
                <span className="text-sm text-[#9cadce]">Countries Visited</span>
              </div>
              
              <div className="bg-[#111111] border border-[#232323] rounded-lg p-4 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center mb-3">
                  <FaPlane className="text-2xl text-blue-400" />
                </div>
                <span className="text-3xl font-bold text-[#f8f8f8]">{tripStats.distance}</span>
                <span className="text-sm text-[#9cadce]">Total Distance (km)</span>
              </div>
            </div>
          </motion.div>
          
          {/* Popular Destinations Carousel - Replacing Popular Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[#f8f8f8]">Popular Destinations</h2>
              <div className="flex space-x-2">
              </div>
            </div>
            
            <div className="relative">
              {/* Carousel navigation buttons */}
              <button 
                onClick={prevDestination} 
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all text-white"
                aria-label="Previous destination"
              >
                <FaChevronLeft />
              </button>
              
              <button 
                onClick={nextDestination} 
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all text-white"
                aria-label="Next destination"
              >
                <FaChevronRight />
              </button>
              
              {/* Carousel container */}
              <div className="overflow-hidden">
                <div 
                  className="flex transition-all duration-500 ease-in-out" 
                  style={{ transform: `translateX(-${activeDestination * 100}%)` }}
                >
                  {popularDestinations.map((destination) => (
                    <div key={destination.id} className="w-full flex-shrink-0">
                      <div className="aspect-[16/9] relative rounded-lg overflow-hidden">
                        {/* Gradient overlay for better text visibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                        
                        {/* Background image */}
                        <img 
                          src={destination.image} 
                          alt={destination.name} 
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        
                        {/* Destination info */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                          <h3 className="text-2xl font-bold text-white mb-2">{destination.name}</h3>
                          <p className="text-gray-200 mb-4">{destination.description}</p>
                          
                          <Link to="/plan">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-5 py-2 bg-[#9cadce] hover:bg-[#8b9dbd] text-black font-medium rounded-md flex items-center"
                            >
                              <FaPlane className="mr-2" /> Plan Trip Here
                            </motion.button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Carousel indicators */}
              <div className="flex justify-center mt-4 space-x-2">
                {popularDestinations.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveDestination(index)}
                    className={`h-2 rounded-full transition-all ${
                      activeDestination === index ? 'w-6 bg-[#9cadce]' : 'w-2 bg-[#232323]'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Quick Actions - Simple buttons for common actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-xl font-semibold mb-4 text-[#f8f8f8]">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <Link to="/plan">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-[#9cadce] hover:bg-[#8b9dbd] text-black font-medium rounded-md flex items-center"
                >
                  <FaRoute className="mr-2" /> Plan New Trip
                </motion.button>
              </Link>
              
              <Link to="/explore">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-[#111111] hover:bg-[#161616] text-[#9cadce] border border-[#232323] font-medium rounded-md flex items-center"
                >
                  <FaCompass className="mr-2" /> Explore Destinations
                </motion.button>
              </Link>
              
              <Link to="/trip-history">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-[#111111] hover:bg-[#161616] text-[#9cadce] border border-[#232323] font-medium rounded-md flex items-center"
                >
                  <FaHistory className="mr-2" /> View Trip History
                </motion.button>
              </Link>
            </div>
          </motion.div>
          
          {/* Trip History Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[#f8f8f8]">Recent Trips</h2>
              <Link to="/trip-history" className="text-sm text-[#9cadce] hover:underline">
                View All
              </Link>
            </div>
            <TripHistory limit={3} />
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
};

const Dashboard = () => {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
};

export default Dashboard;
