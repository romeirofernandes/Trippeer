import React from 'react';

const GradientText = ({ children, className = '' }) => {
  return (
    <span className={`bg-clip-text text-transparent bg-gradient-to-r from-[#9cadce] to-[#ffffff] ${className}`}>
      {children}
    </span>
  );
};

export default GradientText;