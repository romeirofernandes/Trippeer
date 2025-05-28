import Spline from "@splinetool/react-spline";
import { useState, useEffect } from "react";

export default function DarkEarth() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Don't render on mobile/tablet
  if (isMobile) {
    return null;
  }

  return (
    <div className="w-full h-full opacity-85 relative">
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <div className="w-32 h-32 border-4 border-[#9cadce]/20 border-t-[#9cadce] rounded-full animate-spin"></div>
        </div>
      )}

      {/* Overlay gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/90 via-transparent to-[#080808]/90 z-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/90 via-transparent to-[#080808]/90 z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080808] to-transparent z-20" />

      {/* Color overlays */}
      <div className="absolute inset-0 bg-[#9cadce]/10 mix-blend-overlay z-10" />
      <div className="absolute inset-0 bg-[#ffffff]/5 mix-blend-soft-light z-10" />

      {/* Spline container with optimizations */}
      <div className="relative z-0 [&_button]:hidden [&_button]:!hidden [&_button]:!opacity-0 [&_button]:!invisible">
        <Spline
          scene="https://prod.spline.design/nA7bQes-gaVxOEeD/scene.splinecode"
          onLoad={() => setIsLoaded(true)}
          style={{
            width: "100%",
            height: "100%",
            transition: "opacity 0.5s ease-in-out",
            opacity: isLoaded ? 1 : 0,
          }}
        />
      </div>
    </div>
  );
}
