import Spline from '@splinetool/react-spline';

export default function DarkEarth() {
  return (
    <div className="w-full h-full opacity-85 relative">
      {/* Dark gradient overlays for watermark hiding */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/90 via-transparent to-[#080808]/90 z-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/90 via-transparent to-[#080808]/90 z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080808] to-transparent z-20" />
      
      {/* Ambient lighting layers */}
      <div className="absolute inset-0 bg-[#9cadce]/10 mix-blend-overlay z-10" />
      <div className="absolute inset-0 bg-[#ffffff]/5 mix-blend-soft-light z-10" />
      
      {/* Spline scene with lower z-index */}
      <div className="relative z-0 [&_button]:hidden [&_button]:!hidden [&_button]:!opacity-0 [&_button]:!invisible">
        <Spline scene="https://prod.spline.design/nA7bQes-gaVxOEeD/scene.splinecode" />
      </div>
    </div>
  );
}
