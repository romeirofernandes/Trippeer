import React from 'react';
import GradientText from './GradientText';

const SectionTitle = ({ children, centered = true, className = '' }) => {
  return (
    <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${centered ? 'text-center' : ''} ${className}`}>
      <GradientText>{children}</GradientText>
    </h2>
  );
};

export default SectionTitle;