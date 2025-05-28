import React from "react";
import { motion } from "framer-motion";

const LoadingAnimation = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 md:py-12">
      <div className="relative w-16 h-16 md:w-20 md:h-20">
        <motion.div
          className="absolute inset-0 border-4 border-[#9cadce] rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-0 border-4 border-t-transparent border-[#9cadce] rounded-full"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
      <motion.p
        className="mt-4 text-sm md:text-base text-[#9cadce]"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {message}
      </motion.p>
    </div>
  );
};

export default LoadingAnimation;
