import React, { useEffect } from 'react';
import Hero from './landing/Hero';
import HowItWorks from './landing/HowItWorks';
import Features from './landing/Features';
import Testimonials from './landing/Testimonials';
import CTA from './landing/CTA';
import Footer from './landing/Footer';

const Landing = () => {
  return (
    <div className="bg-[#080808] text-white overflow-hidden">
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