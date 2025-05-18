import React from 'react';
import SectionTitle from './SectionTitle';
import { MapPin, Heart, Sparkles, Map } from 'lucide-react';
import Card from './Card';

const steps = [
  {
    id: 1,
    title: 'Choose your destination',
    description: 'Select where you want to go or let AI suggest undiscovered gems.',
    icon: MapPin,
  },
  {
    id: 2,
    title: 'Pick your interests',
    description: 'Tell us what you love, from food tours to historical sites.',
    icon: Heart,
  },
  {
    id: 3,
    title: 'Let AI craft your itinerary',
    description: 'Our AI builds a perfect schedule based on your preferences.',
    icon: Sparkles,
  },
  {
    id: 4,
    title: 'Explore it on the map',
    description: 'Visualize your journey and make adjustments in real-time.',
    icon: Map,
  }
];

const StepCard = ({ step, index }) => {
  const { id, title, description, icon: Icon } = step;
  
  return (
    <div className="flex flex-col items-center" data-aos="fade-up" data-aos-delay={index * 100}>
      <Card className="w-full h-full flex flex-col items-center p-8 relative" hover>
        <div className="absolute -top-6 w-12 h-12 rounded-full bg-gradient-to-r from-[#9cadce] to-[#ffffff] flex items-center justify-center text-white font-bold text-lg shadow-lg">
          {id}
        </div>
        
        <div className="mb-4 mt-4 text-[#9cadce]">
          <Icon size={40} className="stroke-[#9cadce]" />
        </div>
        
        <h3 className="text-xl font-semibold mb-2 text-white text-center">{title}</h3>
        <p className="text-gray-300 text-center">{description}</p>
      </Card>
    </div>
  );
};

const HowItWorks = () => {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-[#080808] z-0" />
      
      <div className="container mx-auto px-6 relative z-10">
        <SectionTitle>How It Works</SectionTitle>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mt-16">
          {steps.map((step, index) => (
            <StepCard key={step.id} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;