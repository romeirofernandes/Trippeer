import React from "react";
import { motion } from "framer-motion";
import { FaCompass } from "react-icons/fa";

const StartButton = ({ onStart, isLoading, disabled }) => {
  return (
    <motion.button
      className={`
        w-full max-w-md mx-auto flex items-center justify-center
        py-4 px-8 rounded-lg text-lg font-medium
        ${
          isLoading || disabled
            ? "bg-[#1a1a1a] text-gray-500 cursor-not-allowed"
            : "bg-[#1a1a1a] text-[#9cadce] hover:bg-[#232323]"
        }
        border border-dotted border-[#434343]
        transition-all duration-200
        shadow-lg
      `}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onStart}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <div className="flex items-center space-x-3">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Preparing Your Adventure...</span>
        </div>
      ) : disabled ? (
        <div className="flex items-center space-x-3">
          <span>Waiting for location access...</span>
        </div>
      ) : (
        <div className="flex items-center space-x-3">
          <FaCompass className="w-5 h-5" />
          <span>Start Mumbai Drift</span>
        </div>
      )}
    </motion.button>
  );
};

export default StartButton;
