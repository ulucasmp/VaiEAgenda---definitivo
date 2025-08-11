
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon-only';
  className?: string;
}

const Logo = ({ size = 'md', variant = 'full', className = '' }: LogoProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10', 
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} relative flex items-center justify-center mb-1 mx-auto`}>
        {/* Background gradient rounded square - using rounded-lg for consistency */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-lg"></div>
        
        {/* VA text */}
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <span className="text-white font-bold text-lg leading-none">
            VA
          </span>
        </div>
      </div>

      {/* Text Logo positioned below the icon */}
      {variant === 'full' && (
        <h1 className={`${textSizeClasses[size]} font-bold tracking-tight text-blue-400`}>
          VaiEAgenda
        </h1>
      )}
    </div>
  );
};

export default Logo;
