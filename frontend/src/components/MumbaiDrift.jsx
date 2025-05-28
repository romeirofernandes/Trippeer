import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import CheckpointManager from "./CheckpointManager";
import MapView from "./MapView";
import FinalReveal from "./FinalReveal";
import StartButton from "./StartButton";
import { mumbaiSpots } from "../../data/mumbaiSpots";
import {
  calculateDistance,
  generateCheckpoints,
} from "../../utils/locationUtils";
import Sidebar, { SidebarProvider, useSidebar } from "../components/Sidebar";

const MumbaiDriftContent = () => {
  const { isOpen } = useSidebar();
  const [userLocation, setUserLocation] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(() => {
    const saved = localStorage.getItem("mumbaiDrift_selectedSpot");
    return saved ? JSON.parse(saved) : null;
  });
  const [checkpoints, setCheckpoints] = useState(() => {
    const saved = localStorage.getItem("mumbaiDrift_checkpoints");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentCheckpoint, setCurrentCheckpoint] = useState(() => {
    const saved = localStorage.getItem("mumbaiDrift_currentCheckpoint");
    return saved ? parseInt(saved) : 0;
  });
  const [isComplete, setIsComplete] = useState(() => {
    const saved = localStorage.getItem("mumbaiDrift_isComplete");
    return saved ? JSON.parse(saved) : false;
  });
  const [startTime, setStartTime] = useState(() => {
    const saved = localStorage.getItem("mumbaiDrift_startTime");
    return saved ? parseInt(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => console.error(error),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Add effect to save state changes
  useEffect(() => {
    if (selectedSpot) {
      localStorage.setItem(
        "mumbaiDrift_selectedSpot",
        JSON.stringify(selectedSpot)
      );
      localStorage.setItem(
        "mumbaiDrift_checkpoints",
        JSON.stringify(checkpoints)
      );
      localStorage.setItem(
        "mumbaiDrift_currentCheckpoint",
        currentCheckpoint.toString()
      );
      localStorage.setItem(
        "mumbaiDrift_isComplete",
        JSON.stringify(isComplete)
      );
      localStorage.setItem(
        "mumbaiDrift_startTime",
        startTime?.toString() || ""
      );
    }
  }, [selectedSpot, checkpoints, currentCheckpoint, isComplete, startTime]);

  const quitDrift = () => {
    // Clear localStorage when quitting
    localStorage.removeItem("mumbaiDrift_selectedSpot");
    localStorage.removeItem("mumbaiDrift_checkpoints");
    localStorage.removeItem("mumbaiDrift_currentCheckpoint");
    localStorage.removeItem("mumbaiDrift_isComplete");
    localStorage.removeItem("mumbaiDrift_startTime");

    // Reset state
    setSelectedSpot(null);
    setCheckpoints([]);
    setCurrentCheckpoint(0);
    setIsComplete(false);
    setStartTime(null);
  };

  const startDrift = async () => {
    setIsLoading(true);
    try {
      // Check if we have user location
      if (!userLocation) {
        throw new Error("Please enable location access to start the drift");
      }

      // Log user location for debugging
      console.log("📍 Starting from:", userLocation);

      const sortedSpots = mumbaiSpots
        .map((spot) => ({
          ...spot,
          distance: calculateDistance(userLocation, spot.coordinates),
        }))
        .sort((a, b) => a.distance - b.distance);

      // Validate if we have spots
      if (!sortedSpots.length) {
        throw new Error("No destinations available");
      }

      // Get closest 5 spots
      const closestSpots = sortedSpots.slice(0, 5);

      // Log available spots
      console.log(
        "🎯 Available destinations:",
        closestSpots.map((spot) => ({
          name: spot.name,
          distance: `${spot.distance.toFixed(2)}km`,
        }))
      );

      const randomIndex = Math.floor(Math.random() * 5);
      const selected = closestSpots[randomIndex];

      // Log selected spot
      console.log("✨ Selected Destination:", {
        name: selected.name,
        distance: `${selected.distance.toFixed(2)}km`,
      });

      const points = await generateCheckpoints(userLocation, selected);

      setSelectedSpot(selected);
      setCheckpoints(points);
      setCurrentCheckpoint(0);
      setIsComplete(false);
      setStartTime(Date.now());
    } catch (error) {
      console.error("Failed to start drift:", error);
      alert(error.message || "Failed to generate route. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const checkProgress = () => {
    if (!selectedSpot || !userLocation) return;

    const currentPoint = checkpoints[currentCheckpoint];
    const distance = calculateDistance(userLocation, currentPoint.coordinates);

    if (distance <= 0.15) {
      // Within 150m
      if (currentCheckpoint === checkpoints.length - 1) {
        setIsComplete(true);
        setTotalTime((Date.now() - startTime) / 1000 / 60); // Convert to minutes
        confetti();
      } else {
        setCurrentCheckpoint((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(checkProgress, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [userLocation, currentCheckpoint]);

  return (
    <div className="flex min-h-screen bg-[#080808]">
      <Sidebar />
      <motion.main
        initial={{ marginLeft: "64px" }}
        animate={{
          marginLeft: isOpen ? "240px" : "64px",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#f8f8f8]">
              Mumbai Drift - Chaos Mode
            </h1>

            {selectedSpot && !isComplete && (
              <motion.button
                onClick={quitDrift}
                className="flex items-center justify-center sm:justify-start space-x-2 px-3 sm:px-4 py-2 rounded-lg text-[#9cadce] border border-dotted border-[#434343] hover:bg-[#1a1a1a] transition-colors text-sm sm:text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span>Quit Drift</span>
              </motion.button>
            )}
          </div>

          <motion.div
            className="space-y-4 sm:space-y-6 bg-[#111111] rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 border border-dotted border-[#434343] shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {!selectedSpot ? (
              <div className="flex flex-col items-center space-y-4 sm:space-y-6 py-6 sm:py-8 md:py-12">
                <motion.div
                  className="text-center mb-4 sm:mb-6 md:mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-gray-400 mb-2 text-sm sm:text-base">
                    Ready for a mystery adventure?
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    We'll guide you through hidden gems of Mumbai
                  </p>
                </motion.div>
                <StartButton
                  onStart={startDrift}
                  isLoading={isLoading}
                  disabled={!userLocation}
                />
              </div>
            ) : isComplete ? (
              <FinalReveal
                spot={selectedSpot}
                time={totalTime}
                onRestart={quitDrift}
              />
            ) : (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-[#161616] rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-[#f8f8f8] mb-3 sm:mb-4">
                      Current Checkpoint
                    </h2>
                    <CheckpointManager
                      checkpoints={checkpoints}
                      currentCheckpoint={currentCheckpoint}
                    />
                  </div>
                  <div className="bg-[#161616] rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-[#f8f8f8] mb-3 sm:mb-4">
                      Map View
                    </h2>
                    <MapView
                      userLocation={userLocation}
                      checkpoints={checkpoints}
                      currentCheckpoint={currentCheckpoint}
                      selectedSpot={selectedSpot}
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
};

// Wrap the main component with SidebarProvider
const MumbaiDrift = () => {
  return (
    <SidebarProvider>
      <MumbaiDriftContent />
    </SidebarProvider>
  );
};

export default MumbaiDrift;
