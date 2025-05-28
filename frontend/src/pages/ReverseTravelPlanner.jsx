import React, { useState, useContext, createContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import axios from "axios";
import MoodSelector from "../components/MoodSelector";
import DurationSlider from "../components/DurationSlider";
import LocationInput from "../components/LocationInput";
import WeatherDropdown from "../components/WeatherDropdown";
import DestinationCard from "../components/DestinationCard";
import LoadingAnimation from "../components/LoadingAnimation";
import WildcardButton from "../components/WildcardButton";
import Sidebar, { SidebarProvider, useSidebar } from "../components/Sidebar";
import AdventureWheel from "../components/AdventureWheel";
import { toast } from "react-toastify";
import { TravelContext, TravelProvider } from "../context/TravelContext";

// Animations config
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

// Trip types
const tripTypes = [
  { value: "solo", label: "🧭 Solo" },
  { value: "couple", label: "💑 Couple" },
  { value: "friends", label: "👥 Friends" },
  { value: "family", label: "👨‍👩‍👧‍👦 Family" },
];

// Weather options
const weatherOptions = [
  { value: "cold", label: "❄️ Cold" },
  { value: "sunny", label: "☀️ Sunny" },
  { value: "rainy", label: "🌧️ Rainy" },
];

// Separate the content into its own component to use the useSidebar hook
const ReverseTravelPlannerContent = () => {
  const { isOpen } = useSidebar();
  const {
    state: {
      budget,
      duration,
      startLocation,
      mood,
      weather,
      tripType,
      maxTravelTime,
      destinations,
      loading,
      error,
    },
    dispatch,
  } = useContext(TravelContext);

  // Convert currency using API
  const convertCurrency = async (amount, from, to = "USD") => {
    try {
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/${from}`
      );
      return amount * response.data.rates[to];
    } catch (error) {
      console.error("Currency conversion failed:", error);
      return amount; // Fallback to original amount
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startLocation || !startLocation.lat || !startLocation.lon) {
    toast.error("Please select a valid location from the dropdown", {
      position: "top-right",
      autoClose: 4000,
      style: { backgroundColor: "#ff4757" }
    });
    return;
  }
  
  dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      // Convert budget to USD
      const budgetUSD = await convertCurrency(budget, "USD");

      // Call Gemini API
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/travel/generate-destinations`,
        {
          location: startLocation,
          budget: budgetUSD,
          duration,
          mood,
          weather,
          tripType,
          maxTravelTime,
        }
      );

      // Launch confetti on success
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      dispatch({ type: "SET_DESTINATIONS", payload: response.data });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
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
        className="flex-1 p-4 sm:p-6 md:p-8"
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-[#f8f8f8]">
            Reverse Travel Planner
          </h1>

          {/* Form Section */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6 sm:space-y-8 bg-[#111111] rounded-xl p-4 sm:p-6 md:p-8 border border-[#232323] shadow-xl"
          >
            {/* Budget Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#f8f8f8]">
                Budget
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9cadce]">$</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_BUDGET",
                      payload: e.target.value,
                    })
                  }
                  className="w-full pl-8 pr-4 py-3 bg-[#161616] border border-[#232323] rounded-lg focus:ring-2 focus:ring-[#9cadce] transition-all text-[#f8f8f8] text-base"
                  placeholder="Enter amount in your currency"
                  required
                />
              </div>
            </div>

            {/* Other form components */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4">
                <DurationSlider
                  value={duration}
                  onChange={(val) =>
                    dispatch({
                      type: "SET_DURATION",
                      payload: val,
                    })
                  }
                />

                <LocationInput
                  value={startLocation}
                  onChange={(val) =>
                    dispatch({
                      type: "SET_LOCATION",
                      payload: val,
                    })
                  }
                />
              </div>

              <div className="space-y-4">
                <MoodSelector
                  value={mood}
                  onChange={(val) =>
                    dispatch({
                      type: "SET_MOOD",
                      payload: val,
                    })
                  }
                />

                <WeatherDropdown
                  value={weather}
                  options={weatherOptions}
                  onChange={(val) =>
                    dispatch({
                      type: "SET_WEATHER",
                      payload: val,
                    })
                  }
                />
              </div>

              {/* Trip Type Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#f8f8f8]">
                  Trip Type
                </label>
                <select
                  value={tripType}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_TRIP_TYPE",
                      payload: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-[#161616] border border-[#232323] rounded-lg focus:ring-2 focus:ring-[#9cadce] transition-all text-[#f8f8f8] text-base"
                >
                  {tripTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Max Travel Time Slider */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#f8f8f8]">
                  Max Travel Time (hours)
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={maxTravelTime}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_MAX_TRAVEL_TIME",
                        payload: parseInt(e.target.value),
                      })
                    }
                    className="w-full accent-[#9cadce] h-2 rounded-lg"
                  />
                  <div className="flex justify-between text-sm text-[#a0a0a0] mt-2">
                    <span>1h</span>
                    <span className="font-medium">{maxTravelTime}h</span>
                    <span>12h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-6 bg-[#9cadce] hover:bg-[#8b9dbd] rounded-lg font-medium text-[#f8f8f8] shadow-lg hover:shadow-xl transition-all disabled:opacity-50 text-base"
            >
              {loading ? <LoadingAnimation /> : "Find Destinations"}
            </motion.button>
          </motion.form>

          {/* Results Section */}
          <AnimatePresence>
            {destinations && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8 sm:mt-12 space-y-6 sm:space-y-8"
              >
                {/* International Destinations */}
                <div className="bg-[#111111] rounded-xl p-4 sm:p-6 border border-[#232323]">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-[#f8f8f8] flex items-center">
                    <span className="mr-2">🌍</span> International Destinations
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {destinations.international.map((dest, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <DestinationCard
                          destination={dest}
                          delay={index * 0.1}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Domestic Destinations */}
                <div className="bg-[#111111] rounded-xl p-4 sm:p-6 border border-[#232323]">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-[#f8f8f8] flex items-center">
                    <span className="mr-2">🏠</span> Domestic Destinations
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {destinations.domestic.map((dest, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <DestinationCard
                          destination={dest}
                          delay={index * 0.1}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Adventure Wheel Section */}
                <div className="bg-[#111111] rounded-xl p-4 sm:p-6 md:p-8 border border-[#232323]">
                  <div className="max-w-3xl mx-auto">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-[#f8f8f8] text-center flex items-center justify-center">
                      <span className="mr-2">🎡</span> Spin for a Random Adventure!
                    </h2>
                    <div className="relative w-full max-w-[280px] sm:max-w-[384px] mx-auto mb-4 sm:mb-6">
                      <AdventureWheel />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-[#a0a0a0] text-sm sm:text-base">
                        Can't decide? Let the wheel choose your next adventure!
                      </p>
                      <p className="text-[#9cadce] text-xs sm:text-sm">
                        Click the wheel to spin and discover your next destination
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 px-6 bg-[#9cadce] hover:bg-[#8b9dbd] rounded-lg font-medium text-[#f8f8f8] shadow-lg hover:shadow-xl transition-all text-sm sm:text-base flex items-center justify-center"
                  >
                    <span className="mr-2">📱</span> Save to Mobile
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 px-6 bg-[#232323] hover:bg-[#2a2a2a] rounded-lg font-medium text-[#f8f8f8] shadow-lg hover:shadow-xl transition-all text-sm sm:text-base flex items-center justify-center"
                  >
                    <span className="mr-2">📤</span> Share Results
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm sm:text-base"
            >
              {error}
            </motion.div>
          )}
        </div>
      </motion.main>
    </div>
  );
};

// Wrap the main component with both providers
const ReverseTravelPlanner = () => {
  return (
    <SidebarProvider>
      <TravelProvider>
        <ReverseTravelPlannerContent />
      </TravelProvider>
    </SidebarProvider>
  );
};

export default ReverseTravelPlanner;
