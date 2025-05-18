import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="py-12 bg-[#080808] text-[#ffffff]/80 relative">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[80%] h-[1px] bg-gradient-to-r from-transparent via-[#232323] to-transparent"></div>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-xs text-gray-300"
          >
            © 2025 All rights reserved.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-sm text-gray-300"
          >
            Crafted by Team CPU
          </motion.p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
