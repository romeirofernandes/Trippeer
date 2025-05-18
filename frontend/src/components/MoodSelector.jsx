import React from "react";
import { motion } from "framer-motion";

const moods = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😴", label: "Relaxed" },
  { emoji: "🥳", label: "Party" },
  { emoji: "🧘", label: "Calm" },
  { emoji: "🤠", label: "Adventure" },
];

const MoodSelector = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#f8f8f8]">
        Current Mood
      </label>
      <div className="grid grid-cols-5 gap-2">
        {moods.map(({ emoji, label }) => (
          <motion.button
            key={emoji}
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(emoji)}
            className={`p-3 rounded-lg ${
              value === emoji
                ? "bg-[#9cadce]/20 border-[#9cadce]"
                : "bg-[#161616] border-[#232323]"
            } border transition-all`}
          >
            <span className="text-2xl">{emoji}</span>
            <span className="block text-xs mt-1 text-[#f8f8f8]">{label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
