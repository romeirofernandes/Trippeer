import React from "react";
import { motion } from "framer-motion";

const wildcardDestinations = [
  "🏃‍♂️ Sprint to the nearest train station and take the first train!",
  "🎲 Roll a dice to pick a random country from your continent!",
  "🧘‍♀️ Find the closest meditation retreat and disconnect!",
  "🌋 Visit the nearest volcano (active or not, you choose)!",
  "🏖️ Beach hop until you find the perfect sunset spot!",
];

const WildcardButton = () => {
  const [destination, setDestination] = React.useState("");

  const generateWildcard = () => {
    const random = Math.floor(Math.random() * wildcardDestinations.length);
    setDestination(wildcardDestinations[random]);
  };

  return (
    <div className="text-center mt-12">
      <motion.button
        whileHover={{ scale: 1.05, rotate: [0, -5, 5, -5, 5, 0] }}
        whileTap={{ scale: 0.95 }}
        onClick={generateWildcard}
        className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl font-bold shadow-lg"
      >
        🎲 Spin the Wheel of Adventure!
      </motion.button>

      {destination && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-xl"
        >
          {destination}
        </motion.div>
      )}
    </div>
  );
};

export default WildcardButton;
