import React from "react";
import SectionTitle from "./SectionTitle";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Travel Blogger",
    content: "AI suggestions were spot-on for my Europe trip!",
  },
  {
    name: "Marcus Johnson",
    role: "Business Traveler",
    content: "Saved me hours of planning. Perfect for professionals.",
  },
  {
    name: "Elena Rodriguez",
    role: "Adventure Seeker",
    content: "Found hidden gems I never would have discovered.",
  },
  {
    name: "David Kim",
    role: "Digital Nomad",
    content: "Recommendations matched my budget perfectly.",
  },
  {
    name: "Lisa Thompson",
    role: "Family Traveler",
    content: "Planning with kids is so much easier now.",
  },
  {
    name: "Alex Rivera",
    role: "Solo Explorer",
    content: "Gave me confidence to explore new destinations alone.",
  },
];

const TestimonialCard = ({ testimonial }) => {
  const { name, role, content } = testimonial;

  return (
    <div className="bg-[#161616] border border-[#232323] rounded-lg p-4 mx-2 min-w-[280px] hover:shadow-[0_0_20px_rgba(156,173,206,0.1)] transition-all duration-300 hover:border-[#9cadce]/30">
      <p className="text-gray-300 mb-3 text-sm leading-relaxed">"{content}"</p>

      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#9cadce] to-[#ffffff] flex items-center justify-center mr-3">
          <span className="text-black font-semibold text-xs">
            {name.charAt(0)}
          </span>
        </div>
        <div>
          <h4 className="text-white font-medium text-sm">{name}</h4>
          <p className="text-[#9cadce] text-xs">{role}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  // Create multiple sets for seamless infinite loop
  const repeatedTestimonials = [
    ...testimonials,
    ...testimonials,
    ...testimonials,
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#080808] to-[#080808] z-0" />

      <div className="container mx-auto px-6 relative z-10 max-w-5xl">
        <SectionTitle>What Travelers Say</SectionTitle>

        <div className="mt-12 relative">
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#080808] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#080808] to-transparent z-10 pointer-events-none" />

          {/* Marquee Container */}
          <div className="overflow-hidden">
            <motion.div
              animate={{ x: [0, -100 * testimonials.length] }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
              className="flex"
            >
              {repeatedTestimonials.map((testimonial, index) => (
                <TestimonialCard key={index} testimonial={testimonial} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
