import React from 'react';

const Card = ({ children, className = '', hover = false }) => {
  const baseClasses = "glass-effect rounded-2xl p-6 relative overflow-hidden transition-all duration-300";
  const hoverClasses = hover ? "hover:shadow-[0_0_30px_rgba(156,173,206,0.2)] hover:scale-[1.02]" : "";
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`}>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Card;