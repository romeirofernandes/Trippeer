import React from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";

const CheckpointManager = ({
  checkpoints,
  currentCheckpoint,
  totalCheckpoints,
}) => {
  const checkpoint = checkpoints[currentCheckpoint];

  return (
    <motion.div
      className="bg-[#111111] rounded-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <FaMapMarkerAlt className="text-[#9cadce]" />
          <span className="text-lg font-medium text-[#f8f8f8]">
            Checkpoint {currentCheckpoint + 1}
            <span className="text-gray-500"> of {totalCheckpoints}</span>
          </span>
        </div>
        <div className="text-xs text-[#9cadce] border border-dotted border-[#232323] px-3 py-1 rounded-full">
          {Math.round(((currentCheckpoint + 1) / totalCheckpoints) * 100)}%
          Complete
        </div>
      </div>

      <motion.div
        key={currentCheckpoint}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="bg-[#161616] p-4 rounded-lg border border-dotted border-[#232323]">
          <p className="text-gray-300 italic text-sm">"{checkpoint.message}"</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-[#9cadce]">
              <FaClock className="text-[#9cadce]" />
              <span>Time to next checkpoint</span>
            </div>
            <span className="font-medium text-[#f8f8f8]">
              {checkpoint.timeToNext} min
            </span>
          </div>

          <div className="w-full bg-[#161616] rounded-full h-1.5 border border-dotted border-[#232323]">
            <motion.div
              className="bg-[#9cadce] h-1.5 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentCheckpoint + 1) / totalCheckpoints) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CheckpointManager;
