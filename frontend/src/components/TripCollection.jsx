import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { FaPlus, FaSpinner, FaTrash } from "react-icons/fa";
import { DraggableCardBody, DraggableCardContainer } from "./DraggableCard";
import Sidebar, { SidebarProvider, useSidebar } from "../components/Sidebar";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const TripCollectionContent = () => {
  const { isOpen } = useSidebar();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      const fileName = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("trippy")
        .upload(`public/${fileName}`, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("trippy")
        .getPublicUrl(`public/${fileName}`);

      setTrips((prev) => [
        {
          id: Date.now(),
          image_url: data.publicUrl,
          title: "New Trip",
          className: `absolute top-${Math.floor(
            Math.random() * 40
          )}0 left-[${Math.floor(Math.random() * 60)}%] rotate-[${Math.floor(
            Math.random() * 10
          )}deg]`,
        },
        ...prev,
      ]);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message);
    } finally {
      setUploading(false);
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
        className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8"
      >
        <DraggableCardContainer className="relative flex min-h-screen w-full items-center justify-center overflow-clip">
          {trips.length === 0 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10 px-4 sm:px-6 md:px-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#f8f8f8] mb-3 sm:mb-4">
                Your Travel Collection
              </h2>
              <p className="text-sm sm:text-base text-[#a0a0a0] max-w-md mx-auto mb-6 sm:mb-8">
                Every journey begins with a single step. Start your collection
                by uploading photos from your favorite travel memories. Drag
                them around to create your perfect memory wall.
              </p>
              <label
                htmlFor="tripImage"
                className="inline-flex items-center gap-2 cursor-pointer bg-[#9cadce] px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-white hover:bg-[#8b9dbd] transition-colors text-sm sm:text-base"
              >
                <FaPlus className="text-xs sm:text-sm" /> Add Your First Memory
              </label>
            </div>
          )}

          {/* Upload button and error message */}
          <input
            type="file"
            id="tripImage"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Trip cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6">
            {trips.map((trip, index) => (
              <motion.div
                key={trip.id}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                  <img
                    src={trip.image_url}
                    alt={`Trip to ${trip.title}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      onClick={() => {
                        // Implement delete functionality
                      }}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <FaTrash className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 sm:mt-3">
                  <h3 className="text-sm sm:text-base font-medium text-[#f8f8f8]">
                    {trip.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#a0a0a0]">
                    {/* Add date formatting */}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Error message */}
          {error && (
            <div className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg z-50 text-sm sm:text-base">
              {error}
            </div>
          )}
        </DraggableCardContainer>
      </motion.main>
    </div>
  );
};

// Wrap the main component with SidebarProvider
export function TripCollection() {
  return (
    <SidebarProvider>
      <TripCollectionContent />
    </SidebarProvider>
  );
}
