import React from 'react';
import Button from './Button';
import GradientText from './GradientText';
import { ArrowRight, Compass } from 'lucide-react';
import DarkEarth from '../spline/DarkEarth';

const Navbar = () => {
  return (
    <nav className="absolute top-0 left-0 right-0 z-20 py-6">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Compass className="w-8 h-8 text-[#9cadce]" />
            <span className="text-2xl font-bold bg-gradient-to-r from-[#9cadce] to-[#ffffff] bg-clip-text text-transparent">
              Trippeer
            </span>
          </div>
          
          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Button primary className="group">
              Sign Up
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes gradientFlow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .animate-fade-in {
    animation: fadeIn 1s ease-out;
  }

  .animate-slide-up {
    animation: slideUp 0.8s ease-out forwards;
  }

  .animate-gradient {
    background-size: 200% auto;
    animation: gradientFlow 3s ease infinite;
  }

  .animation-delay-200 {
    animation-delay: 200ms;
  }

  .animation-delay-300 {
    animation-delay: 300ms;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center relative overflow-hidden gradient-bg">
      <Navbar />
      
      {/* Animated background elements */}
      <div className="absolute w-full h-full">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#9cadce]/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#9cadce]/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-1/2 bg-gradient-to-r from-[#9cadce]/20 via-[#ffffff]/20 to-[#9cadce]/20 blur-[150px]" />
      </div>
      
      <div className="container mx-auto px-6 z-10 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 flex flex-col items-center lg:items-start relative z-20 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center lg:text-left mb-6 leading-tight animate-slide-up">
            Smarter Travel, <br />
            <GradientText className="animate-gradient">Instantly Planned</GradientText>
          </h1>
          
          <p className="text-lg md:text-xl text-[#ffffff]/80 mb-8 text-center lg:text-left max-w-2xl animate-slide-up animation-delay-200">
            Plan your entire trip with AI-powered suggestions and real-time maps.
            Experience travel like never before.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up animation-delay-300">
            <Button primary className="group text-lg px-8 py-4">
              Start Planning
              <ArrowRight className="ml-2 inline-block w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
        
        <div className="absolute inset-0 w-full h-full z-0">
          <div className="relative w-full h-full">
            <DarkEarth />
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowRight className="w-6 h-6 text-white/50 transform rotate-90" />
      </div>
    </section>
  );
};

export default Hero;