import React from 'react';
import SectionTitle from './SectionTitle';
import Card from './Card';
import { Sparkles, Map, Calendar, Share2 } from 'lucide-react';

const features = [
  {
    id: 1,
    title: 'AI Itinerary Builder',
    description: 'Smart algorithm creates personalized plans based on your preferences and travel style.',
    icon: Sparkles,
  },
  {
    id: 2,
    title: 'Map Visualization',
    description: 'See your entire trip laid out on an interactive map with points of interest and routes.',
    icon: Map,
  },
  {
    id: 3,
    title: 'Multi-day Trip Planning',
    description: 'Plan complex itineraries spanning multiple days with optimal time management.',
    icon: Calendar,
  },
  {
    id: 4,
    title: 'Export & Share Itineraries',
    description: 'Easily share your plans with travel companions or export to your calendar.',
    icon: Share2,
  },
];

const FeatureCard = ({ feature }) => {
  const { title, description, icon: Icon } = feature;
  
  return (
    <Card className="h-full" hover>
      <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#9cadce]/20 to-[#ffffff]/20 flex items-center justify-center mb-6">
        <Icon size={28} className="text-[#9cadce]" />
      </div>
      
      <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </Card>
  );
};

const Features = () => {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#080808] to-[#080808] z-0" />
      
      <div className="container mx-auto px-6 relative z-10">
        <SectionTitle>Powerful Features</SectionTitle>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {features.map(feature => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;