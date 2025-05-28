import React from "react";
import { MapPin, Sparkles, Route, CheckCircle } from "lucide-react";
import SectionTitle from "./SectionTitle";
import { motion } from "framer-motion";

const steps = [
  {
    id: 1,
    title: "Set Your Preferences",
    description:
      "Tell us your destination, budget, travel dates, and interests to get started.",
    icon: MapPin,
  },
  {
    id: 2,
    title: "AI Creates Your Plan",
    description:
      "Our AI analyzes thousands of options to create a personalized travel itinerary.",
    icon: Sparkles,
  },
  {
    id: 3,
    title: "Optimize Your Route",
    description:
      "Get optimized routes, flight suggestions, and real-time travel updates.",
    icon: Route,
  },
  {
    id: 4,
    title: "Travel with Confidence",
    description:
      "Access your itinerary anywhere, get live support, and enjoy stress-free travel.",
    icon: CheckCircle,
  },
];

const StepCard = ({ step, index }) => {
  const { id, title, description, icon: Icon } = step;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative group"
    >
      <div className="bg-[#161616] border border-[#232323] rounded-xl p-6 h-full flex flex-col items-center text-center hover:shadow-[0_0_30px_rgba(156,173,206,0.1)] transition-all duration-300 group-hover:border-[#9cadce]/30">
        {/* Number Badge */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-[#9cadce] to-[#ffffff] flex items-center justify-center text-black font-bold text-sm shadow-lg">
          {id}
        </div>

        {/* Icon */}
        <div className="mb-4 mt-4 p-4 rounded-full bg-[#9cadce]/10 group-hover:bg-[#9cadce]/20 transition-colors duration-300">
          <Icon size={32} className="text-[#9cadce]" />
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold mb-3 text-white group-hover:text-[#9cadce] transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
          {description}
        </p>

        {/* Connecting Line */}
        {index < steps.length - 1 && (
          <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-[#9cadce]/50 to-transparent transform -translate-y-1/2" />
        )}
      </div>
    </motion.div>
  );
};

const HowItWorks = () => {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#080808] to-[#080808] z-0" />

      <div className="container mx-auto px-6 relative z-10 max-w-5xl">
        <SectionTitle>How It Works</SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 mt-12 relative">
          {steps.map((step, index) => (
            <StepCard key={step.id} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
