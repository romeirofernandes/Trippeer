import React from "react";
import { motion } from "framer-motion";

const LoadingAnimation = () => {
  return (
    <div className="flex items-center space-x-2">
      <motion.div
        className="h-2 w-2 rounded-full bg-[#9cadce]"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="h-2 w-2 rounded-full bg-[#9cadce]"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1,
          delay: 0.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="h-2 w-2 rounded-full bg-[#9cadce]"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1,
          delay: 0.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default LoadingAnimation;
