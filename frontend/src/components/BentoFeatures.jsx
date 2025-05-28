import React from "react";
import { cn } from "../lib/utils";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import { motion } from "framer-motion";
import { 
  FaRobot, 
  FaRoute, 
  FaGlobeAmericas, 
  FaMapMarkerAlt,
  FaPlane,
  FaCloudSun
} from "react-icons/fa";

const SkeletonAI = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-[#9cadce]/20 to-[#ffffff]/10 rounded-lg flex-col space-y-2 p-4"
    >
      <div className="flex items-center space-x-2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 rounded-full bg-[#9cadce] flex items-center justify-center"
        >
          <FaRobot className="text-white text-sm" />
        </motion.div>
        <div className="text-[#9cadce] text-sm font-medium">AI Planning</div>
      </div>
      <div className="space-y-2">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "80%" }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-2 bg-[#9cadce]/30 rounded-full"
        />
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "60%" }}
          transition={{ duration: 1, delay: 0.7 }}
          className="h-2 bg-[#9cadce]/30 rounded-full"
        />
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "90%" }}
          transition={{ duration: 1, delay: 0.9 }}
          className="h-2 bg-[#9cadce]/30 rounded-full"
        />
      </div>
    </motion.div>
  );
};

const SkeletonRoute = () => {
  return (
    <motion.div
      className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-[#9cadce]/10 to-transparent rounded-lg relative overflow-hidden"
    >
      <motion.div
        animate={{ x: [0, 100, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-4 transform -translate-y-1/2"
      >
        <FaPlane className="text-[#9cadce] text-2xl" />
      </motion.div>
      <div className="absolute top-1/2 left-4 w-full h-px bg-gradient-to-r from-[#9cadce] via-[#9cadce]/50 to-transparent transform -translate-y-1/2" />
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
        <FaMapMarkerAlt className="text-[#9cadce] text-xl" />
      </div>
    </motion.div>
  );
};

const SkeletonGlobe = () => {
  return (
    <motion.div
      className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-[#9cadce]/20 via-[#ffffff]/5 to-transparent rounded-lg items-center justify-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        <FaGlobeAmericas className="text-[#9cadce] text-4xl" />
      </motion.div>
    </motion.div>
  );
};

const SkeletonWeather = () => {
  const variants = {
    initial: { y: 0 },
    animate: { y: [-5, 5, -5] },
  };

  return (
    <motion.div
      className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-blue-500/20 to-yellow-500/20 rounded-lg flex-col items-center justify-center space-y-2"
    >
      <motion.div
        variants={variants}
        animate="animate"
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <FaCloudSun className="text-[#9cadce] text-3xl" />
      </motion.div>
      <div className="text-[#9cadce]/80 text-sm">Real-time Updates</div>
    </motion.div>
  );
};

const SkeletonChat = () => {
  return (
    <motion.div
      className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-[#9cadce]/10 to-transparent rounded-lg flex-col space-y-2 p-4"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="flex items-center space-x-2"
      >
        <div className="w-6 h-6 rounded-full bg-[#9cadce]/30" />
        <div className="bg-[#9cadce]/20 rounded-full px-3 py-1 text-xs text-[#9cadce]">
          Where should I go next?
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="flex items-center space-x-2 justify-end"
      >
        <div className="bg-[#9cadce] rounded-full px-3 py-1 text-xs text-white">
          I recommend Bali! 🏝️
        </div>
        <div className="w-6 h-6 rounded-full bg-[#9cadce]" />
      </motion.div>
    </motion.div>
  );
};

const items = [
  {
    title: "AI-Powered Itineraries",
    description: "Smart travel planning with personalized recommendations based on your preferences and budget.",
    header: <SkeletonAI />,
    className: "md:col-span-2",
    icon: <FaRobot className="h-4 w-4 text-[#9cadce]" />,
  },
  {
    title: "Smart Route Optimization",
    description: "Efficient travel routes with real-time flight tracking and alternative suggestions.",
    header: <SkeletonRoute />,
    className: "md:col-span-1",
    icon: <FaRoute className="h-4 w-4 text-[#9cadce]" />,
  },
  {
    title: "Global Destinations",
    description: "Explore destinations worldwide with detailed insights and local recommendations.",
    header: <SkeletonGlobe />,
    className: "md:col-span-1",
    icon: <FaGlobeAmericas className="h-4 w-4 text-[#9cadce]" />,
  },
  {
    title: "Weather Integration",
    description: "Real-time weather updates and seasonal travel recommendations for optimal planning.",
    header: <SkeletonWeather />,
    className: "md:col-span-1",
    icon: <FaCloudSun className="h-4 w-4 text-[#9cadce]" />,
  },
  {
    title: "Travel Assistant",
    description: "24/7 AI travel assistant for instant answers to your travel questions and support.",
    header: <SkeletonChat />,
    className: "md:col-span-1",
    icon: <FaRobot className="h-4 w-4 text-[#9cadce]" />,
  },
];

export function BentoFeatures() {
  return (
    <BentoGrid className="max-w-5xl mx-auto">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={cn(
            "bg-[#161616] border-[#232323] hover:shadow-[0_0_30px_rgba(156,173,206,0.1)]",
            item.className
          )}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}