import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AdventureWheel = () => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [selectedAdventure, setSelectedAdventure] = useState(null);

  const adventures = [
    {
      text: "Mountain Trek",
      color: "#232323",
      emoji: "🏔️",
      description: "Hiking in the Alps",
    },
    {
      text: "Beach Paradise",
      color: "#2a2a2a",
      emoji: "🏖️",
      description: "Maldives getaway",
    },
    {
      text: "City Explorer",
      color: "#1f1f1f",
      emoji: "🌆",
      description: "Tokyo adventure",
    },
    {
      text: "Cultural Tour",
      color: "#262626",
      emoji: "🏛️",
      description: "Roman history",
    },
    {
      text: "Food Journey",
      color: "#1a1a1a",
      emoji: "🍜",
      description: "Thai cuisine",
    },
    {
      text: "Mystery Trip",
      color: "#212121",
      emoji: "✨",
      description: "Surprise destination",
    },
  ];

  const spinWheel = () => {
    if (!spinning) {
      setSpinning(true);
      setSelectedAdventure(null);
      const newRotation = rotation + 1440 + Math.random() * 360;
      setRotation(newRotation);

      setTimeout(() => {
        const normalizedRotation = newRotation % 360;
        const segmentSize = 360 / adventures.length;
        const selectedIndex = Math.floor(
          (360 - normalizedRotation) / segmentSize
        );
        setSelectedAdventure(adventures[selectedIndex % adventures.length]);
        setSpinning(false);
      }, 3000);
    }
  };

  const getSegmentPath = (index, total) => {
    const angle = 360 / total;
    const startAngle = angle * index;
    const endAngle = startAngle + angle;
    const start = polarToCartesian(50, 50, 50, startAngle);
    const end = polarToCartesian(50, 50, 50, endAngle);
    const largeArcFlag = angle <= 180 ? "0" : "1";

    return [
      "M",
      50,
      50,
      "L",
      start.x,
      start.y,
      "A",
      50,
      50,
      0,
      largeArcFlag,
      1,
      end.x,
      end.y,
      "Z",
    ].join(" ");
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  return (
    <div className="flex flex-col items-center space-y-4 sm:space-y-8">
      <div className="relative w-[280px] h-[280px] sm:w-96 sm:h-96">
        <motion.div
          className="w-full h-full rounded-full relative overflow-hidden"
          style={{
            background: "#111111",
            border: "1px solid #f8f8f8",
            boxShadow: "0 0 30px rgba(0,0,0,0.3)",
            transformOrigin: "center",
          }}
          animate={{ rotate: rotation }}
          transition={{ duration: 3, type: "spring", bounce: 0.2 }}
        >
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {adventures.map((adventure, index) => {
              const angle =
                (360 / adventures.length) * index + 360 / adventures.length / 2;
              return (
                <g key={index}>
                  <path
                    d={getSegmentPath(index, adventures.length)}
                    fill={adventure.color}
                    stroke="#f8f8f8"
                    strokeWidth="0.5"
                  />
                  <text
                    x="50"
                    y="50"
                    textAnchor="middle"
                    transform={`
                      rotate(${angle}, 50, 50)
                      translate(0, -30)
                    `}
                    fill="#f8f8f8"
                    style={{ fontSize: "4px" }}
                  >
                    <tspan x="50" dy="-3" fontSize="6">
                      {adventure.emoji}
                    </tspan>
                    <tspan x="50" dy="6" fill="#f8f8f8" fontWeight="500">
                      {adventure.text}
                    </tspan>
                  </text>
                </g>
              );
            })}
          </svg>
        </motion.div>

        {/* Center button */}
        <button
          onClick={spinWheel}
          disabled={spinning}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     bg-[#9cadce] hover:bg-[#8b9dbd] text-[#f8f8f8] rounded-full 
                     w-16 h-16 sm:w-24 sm:h-24
                     flex items-center justify-center shadow-xl transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed z-20
                     border-4 border-[#232323]"
        >
          <span className="text-base sm:text-xl font-bold">{spinning ? "🎲" : "SPIN!"}</span>
        </button>

        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-30">
          <span className="text-2xl sm:text-3xl text-[#f8f8f8]">▼</span>
        </div>
      </div>

      {/* Result display */}
      <AnimatePresence mode="wait">
        {selectedAdventure && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center p-4 sm:p-6 bg-[#161616] rounded-xl border border-[#232323] shadow-lg w-full max-w-[280px] sm:max-w-[384px]"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-[#f8f8f8] mb-2 sm:mb-3">
              {selectedAdventure.emoji} {selectedAdventure.text}
            </h3>
            <p className="text-[#a0a0a0] text-base sm:text-lg">
              {selectedAdventure.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdventureWheel;
