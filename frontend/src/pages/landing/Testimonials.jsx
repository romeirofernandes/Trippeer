import React from 'react';
import SectionTitle from './SectionTitle';
import Card from './Card';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah J.',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    quote: 'Trippeer made planning our honeymoon so effortless. The AI knew exactly what kind of romantic spots we\'d love!',
  },
  {
    id: 2,
    name: 'Michael T.',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    quote: 'As a solo traveler, I was amazed at how well the app understood my adventure preferences and budget constraints.',
  },
  {
    id: 3,
    name: 'Elena K.',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 4,
    quote: 'The map visualization feature is incredible. I can see my entire week planned out geographically - such a time saver!',
  },
];

const StarRating = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          size={18} 
          className={`${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'} mr-1`} 
        />
      ))}
    </div>
  );
};

const TestimonialCard = ({ testimonial }) => {
  const { name, avatar, rating, quote } = testimonial;
  
  return (
    <Card className="h-full flex flex-col">
      <div className="flex items-center mb-4">
        <img 
          src={avatar} 
          alt={name} 
          className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-[#9cadce]" 
        />
        <div>
          <h4 className="font-semibold text-white">{name}</h4>
          <StarRating rating={rating} />
        </div>
      </div>
      
      <p className="text-gray-300 italic flex-grow">"{quote}"</p>
    </Card>
  );
};

const Testimonials = () => {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-[#080808] z-0" />
      
      <div className="container mx-auto px-6 relative z-10">
        <SectionTitle>What Travelers Say</SectionTitle>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {testimonials.map(testimonial => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;