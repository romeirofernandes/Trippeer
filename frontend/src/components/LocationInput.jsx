import React, { useState } from "react";
import { motion } from "framer-motion";
import LoadingAnimation from "./LoadingAnimation";
import axios from "axios";

const LocationInput = ({ value, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchLocation = async (query) => {
    if (query.length < 3) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: query,
            format: "json",
            limit: 5,
          },
          headers: {
            "User-Agent": "Certifiyo Travel App",
          },
        }
      );
      setSuggestions(response.data);
    } catch (error) {
      console.error("Location search failed:", error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-2 relative">
      <label className="block text-sm font-medium text-[#f8f8f8]">
        Starting Location
      </label>
      <motion.input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          searchLocation(e.target.value);
        }}
        placeholder="Enter your starting point"
        whileFocus={{ scale: 1.02 }}
        className="w-full px-4 py-2 bg-[#161616] border border-[#232323] rounded-lg focus:ring-2 focus:ring-[#9cadce] transition-all text-[#f8f8f8] placeholder-[#a0a0a0]"
      />

      {/* Location Suggestions */}
      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-[#111111] border border-[#232323] rounded-lg shadow-xl">
          {suggestions.map((place) => (
            <button
              key={place.place_id}
              onClick={() => {
                onChange(place.display_name);
                setSuggestions([]);
              }}
              className="w-full px-4 py-2 text-left text-[#f8f8f8] hover:bg-[#161616] transition-colors"
            >
              {place.display_name}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="absolute right-3 top-9">
          <LoadingAnimation />
        </div>
      )}
    </div>
  );
};

export default LocationInput;
