import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="py-12 bg-[#080808] text-[#ffffff]/80 relative">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-[#232323] to-transparent"></div>

      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="text-sm text-gray-400"
          >
            © 2025 All rights reserved.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            className="text-sm text-gray-400"
          >
            crafted by team cpu
          </motion.p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
