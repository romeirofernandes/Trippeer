import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { FaPlus, FaSpinner } from "react-icons/fa";
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

      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from("trippy")
        .upload(`public/${fileName}`, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("trippy").getPublicUrl(`public/${fileName}`);

      setTrips((prev) => [
        {
          id: Date.now(),
          image_url: publicUrl,
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
      console.error("Error:", err);
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
        className="flex-1"
      >
        <DraggableCardContainer className="relative flex min-h-screen w-full items-center justify-center overflow-clip p-8">
          {trips.length === 0 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
              <h2 className="text-4xl font-bold text-[#f8f8f8] mb-4">
                Your Travel Collection
              </h2>
              <p className="text-[#a0a0a0] max-w-md mx-auto mb-8">
                Every journey begins with a single step. Start your collection
                by uploading photos from your favorite travel memories. Drag
                them around to create your perfect memory wall.
              </p>
              <label
                htmlFor="tripImage"
                className="inline-flex items-center gap-2 cursor-pointer bg-[#9cadce] px-6 py-3 rounded-lg text-white hover:bg-[#8b9dbd] transition-colors"
              >
                <FaPlus /> Add Your First Memory
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

          <label
            htmlFor="tripImage"
            className="fixed bottom-8 right-8 z-50 cursor-pointer rounded-full bg-[#9cadce] p-4 shadow-lg hover:bg-[#8b9dbd] transition-colors"
          >
            {uploading ? (
              <FaSpinner className="animate-spin text-2xl text-white" />
            ) : (
              <FaPlus className="text-2xl text-white" />
            )}
          </label>

          {error && (
            <div className="fixed top-4 right-4 bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg">
              {error}
            </div>
          )}

          {/* Trip cards */}
          {trips.map((trip) => (
            <DraggableCardBody key={trip.id} className={trip.className}>
              <img
                src={trip.image_url}
                alt={trip.title}
                className="pointer-events-none relative z-10 h-80 w-80 object-cover rounded-lg"
              />
              <input
                type="text"
                value={trip.title}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  setTrips((prev) =>
                    prev.map((t) =>
                      t.id === trip.id ? { ...t, title: newTitle } : t
                    )
                  );
                }}
                className="mt-4 w-full bg-transparent text-center text-2xl font-bold text-neutral-300 focus:outline-none"
              />
            </DraggableCardBody>
          ))}
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
