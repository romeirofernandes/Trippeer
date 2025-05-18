import React from 'react';
import { motion } from 'framer-motion';

const DurationSlider = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#f8f8f8]">
        Travel Duration (days)
      </label>
      <motion.input
        type="range"
        min="1"
        max="30"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-[#9cadce]"
        whileFocus={{ scale: 1.02 }}
      />
      <div className="flex justify-between text-sm text-[#a0a0a0]">
        <span>1 day</span>
        <span>{value} days</span>
        <span>30 days</span>
      </div>
    </div>
  );
};

export default DurationSlider;