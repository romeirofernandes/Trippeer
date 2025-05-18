import React, { useEffect } from 'react';
import Hero from './landing/Hero';
import HowItWorks from './landing/HowItWorks';
import Features from './landing/Features';
import Testimonials from './landing/Testimonials';
import CTA from './landing/CTA';
import Footer from './landing/Footer';

const Landing = () => {
  useEffect(() => {
    // Update page title
    document.title = 'Trippeer | AI-Powered Travel Planning';
    
    // Add Inter font from Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="font-['Inter'] bg-[#080808] text-white overflow-hidden">
      <Hero />
      <HowItWorks />
      <Features />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};

export default Landing;