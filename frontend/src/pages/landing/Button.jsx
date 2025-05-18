import React from 'react';

const Button = ({ 
  children, 
  primary = false, 
  onClick,
  className = '',
  type = 'button'
}) => {
  const baseClasses = "px-6 py-3 rounded-full font-semibold transition-all duration-300 text-[#080808] relative overflow-hidden group";
  
  const primaryClasses = "bg-[#9cadce] hover:bg-[#9cadce]/80";
  
  const secondaryClasses = "glass-effect hover:bg-[#9cadce]/10";
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${primary ? primaryClasses : secondaryClasses} ${className}`}
      onClick={onClick}
    >
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center">
        {children}
      </div>
    </button>
  );
};

export default Button;