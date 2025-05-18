import React from "react";
import { motion } from "framer-motion";

const WeatherDropdown = ({ value, options, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#f8f8f8]">
        Preferred Weather
      </label>
      <motion.select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        whileFocus={{ scale: 1.02 }}
        className="w-full px-4 py-2 bg-[#161616] border border-[#232323] rounded-lg focus:ring-2 focus:ring-[#9cadce] transition-all text-[#f8f8f8]"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-[#161616] text-[#f8f8f8]"
          >
            {option.label}
          </option>
        ))}
      </motion.select>
    </div>
  );
};

export default WeatherDropdown;
