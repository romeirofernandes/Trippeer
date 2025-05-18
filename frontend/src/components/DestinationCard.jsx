import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const DestinationCard = ({ destination, delay }) => {
  const [photos, setPhotos] = useState([]);
  const [showItinerary, setShowItinerary] = useState(false);
  const [convertedPrice, setConvertedPrice] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get(
          `https://api.unsplash.com/search/photos`,
          {
            params: {
              query: `${destination.name} travel`,
              per_page: 5,
            },
            headers: {
              Authorization: `Client-ID ${
                import.meta.env.VITE_UNSPLASH_ACCESS_KEY
              }`,
            },
          }
        );
        setPhotos(response.data.results);
      } catch (error) {
        console.error("Failed to fetch photos:", error);
      }
    };

    const convertPrice = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/travel/convert-currency`,
          {
            params: {
              amount: destination.cost,
              from: destination.currency,
              to: "USD", // You can make this dynamic based on user preference
            },
          }
        );
        setConvertedPrice(response.data.amount.toFixed(2));
      } catch (error) {
        console.error("Failed to convert currency:", error);
      }
    };

    fetchPhotos();
    convertPrice();
  }, [destination]);

  // Extract coordinates from the array format
  const lat = destination.coordinates[0];
  const lon = destination.coordinates[1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-[#111111] rounded-xl overflow-hidden border border-[#232323] hover:bg-[#161616] transition-all duration-300"
    >
      {/* Image carousel */}
      <div className="relative h-48">
        {photos.length > 0 ? (
          <img
            src={photos[0].urls.regular}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#161616] flex items-center justify-center">
            <span className="text-[#a0a0a0]">No image available</span>
          </div>
        )}
      </div>

      {/* Map preview using OpenStreetMap */}
      <div className="h-48">
        <iframe
          title={`map-${destination.name}`}
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${
            lon - 0.1
          },${lat - 0.1},${lon + 0.1},${
            lat + 0.1
          }&layer=mapnik&marker=${lat},${lon}`}
        />
      </div>

      <div className="p-4">
        <h3 className="text-xl font-semibold text-[#f8f8f8] mb-2">
          {destination.name}
        </h3>

        <p className="text-[#a0a0a0] mb-4">{destination.description}</p>

        <div className="flex justify-between mb-4 text-sm">
          <div className="text-[#a0a0a0]">
            <span className="font-medium text-[#f8f8f8]">Local Price:</span>{" "}
            {destination.cost} {destination.currency}
          </div>
          <div className="text-[#a0a0a0]">
            <span className="font-medium text-[#f8f8f8]">USD Price:</span>{" "}
            {convertedPrice ? `$${convertedPrice}` : "Converting..."}
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => setShowItinerary(true)}
            className="flex-1 px-4 py-2 bg-[#232323] hover:bg-[#2a2a2a] text-[#f8f8f8] rounded-lg transition-colors"
          >
            View Itinerary
          </button>
          <button
            onClick={() =>
              window.open(
                `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}`,
                "_blank"
              )
            }
            className="px-4 py-2 bg-[#161616] hover:bg-[#1a1a1a] text-[#f8f8f8] rounded-lg transition-colors"
          >
            🗺️ Full Map
          </button>
        </div>
      </div>

      {showItinerary && (
        <ItineraryModal
          destination={destination}
          onClose={() => setShowItinerary(false)}
        />
      )}
    </motion.div>
  );
};

export default DestinationCard;
