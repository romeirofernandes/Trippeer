import React from 'react';
import Button from './Button';
import GradientText from './GradientText';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CTA = () => {
  const navigate = useNavigate();
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#080808] to-[#080808] z-0" />
      
      {/* Animated Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-1/2 bg-[#9cadce]/10 rounded-full blur-[120px] animate-pulse" />
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
          Your Next Trip <GradientText>Starts Now</GradientText>
        </h2>
        
        <p className="text-lg text-[#ffffff]/80 mb-8 max-w-2xl mx-auto">
          Join thousands of travelers who have discovered the power of AI-assisted trip planning.
          Get perfect itineraries in seconds, not hours.
        </p>
        
        <Button onClick={() => navigate('/dashboard')} primary className="px-8 py-4 text-lg">
          Launch the Planner
          <ArrowRight className="ml-2 inline-block w-5 h-5" />
        </Button>
      </div>
    </section>
  );
};

export default CTA;