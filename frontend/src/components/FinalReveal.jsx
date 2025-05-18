import React from "react";
import { motion } from "framer-motion";
import { FaShare, FaRedo } from "react-icons/fa";

const FinalReveal = ({ destination, timeTaken, onRestart }) => {
  const shareJourney = () => {
    const text = `I just completed a Mumbai Drift adventure to ${
      destination.name
    } in ${Math.round(timeTaken)} minutes! 🎉`;

    if (navigator.share) {
      navigator.share({
        title: "Mumbai Drift Adventure",
        text: text,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    }
  };

  return (
    <motion.div
      className="bg-[#1a1a1a] rounded-lg p-8 text-center border border-dotted border-[#434343]"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
        className="text-4xl mb-6"
      >
        🎉
      </motion.div>

      <h2 className="text-2xl font-bold mb-4 text-[#f8f8f8]">
        Destination Reached!
      </h2>

      <h3 className="text-xl text-[#9cadce] mb-2">{destination.name}</h3>

      <p className="text-gray-400 mb-6">{destination.description}</p>

      <div className="flex items-center justify-center space-x-2 text-sm text-[#9cadce] mb-8">
        <span className="bg-[#111111] px-4 py-2 rounded-full border border-dotted border-[#434343]">
          {Math.round(timeTaken)} minutes
        </span>
        <span className="bg-[#111111] px-4 py-2 rounded-full border border-dotted border-[#434343]">
          {destination.category}
        </span>
      </div>

      <div className="flex justify-center space-x-4">
        <motion.button
          className="flex items-center space-x-2 bg-[#111111] text-[#9cadce] px-6 py-3 rounded-lg font-medium border border-dotted border-[#434343] hover:bg-[#161616]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={shareJourney}
        >
          <FaShare className="w-4 h-4" />
          <span>Share Journey</span>
        </motion.button>

        <motion.button
          className="flex items-center space-x-2 bg-[#111111] text-[#9cadce] px-6 py-3 rounded-lg font-medium border border-dotted border-[#434343] hover:bg-[#161616]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRestart}
        >
          <FaRedo className="w-4 h-4" />
          <span>Start New Drift</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FinalReveal;
