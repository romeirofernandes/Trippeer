import React, { useState, createContext, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiMenuAlt3 } from "react-icons/hi";
import { FaRoute, FaCompass } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { motion } from "framer-motion";

export const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

const Sidebar = () => {
  const { isOpen, setIsOpen } = useSidebar();
  const location = useLocation();

  const navLinks = [
    { title: "Plan Trip", path: "/plan", icon: <FaRoute size={20} /> },
    { title: "Explore", path: "/explore", icon: <FaCompass size={20} /> },
  ];

  const sidebarVariants = {
    open: {
      width: "240px",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    closed: {
      width: "64px",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const textVariants = {
    open: {
      opacity: 1,
      x: 0,
      display: "block",
      transition: { delay: 0.1, duration: 0.3 },
    },
    closed: {
      opacity: 0,
      x: 20,
      transitionEnd: {
        display: "none",
      },
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      variants={sidebarVariants}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      className="bg-[#0F0F0F] min-h-screen text-[#f8f8f8] px-3 flex flex-col fixed top-0 left-0 z-50"
    >
      {/* Menu Toggle */}
      <div
        className={`py-3 flex ${
          isOpen ? "justify-end pr-2" : "justify-center"
        }`}
      >
        <motion.div>
          <HiMenuAlt3
            size={20}
            className="cursor-pointer hover:text-gray-300 transition-colors duration-300"
            onClick={() => setIsOpen(!isOpen)}
          />
        </motion.div>
      </div>

      {/* Navigation Links */}
      <div className="mt-4 flex flex-col gap-4">
        {navLinks.map((link, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to={link.path}
              className={`${
                location.pathname === link.path ? "bg-[#232323]" : ""
              } group flex items-center ${
                isOpen ? "gap-4" : "justify-center"
              } font-medium p-3 hover:bg-[#232323] rounded-md transition-all duration-300`}
            >
              <div className="flex items-center justify-center">
                {link.icon}
              </div>
              <motion.span variants={textVariants} className="whitespace-pre">
                {link.title}
              </motion.span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Logout Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          /* Add logout logic */
        }}
        className={`mt-auto mb-8 group flex items-center ${
          isOpen ? "gap-4" : "justify-center"
        } font-medium p-3 hover:bg-[#232323] rounded-md transition-all duration-300`}
      >
        <div className="flex items-center justify-center">
          <BiLogOut size={20} />
        </div>
        <motion.span variants={textVariants} className="whitespace-pre">
          Logout
        </motion.span>
      </motion.button>
    </motion.div>
  );
};

export default Sidebar;
