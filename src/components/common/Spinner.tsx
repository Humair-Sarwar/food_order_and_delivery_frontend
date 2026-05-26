import React from 'react';

interface SpinnerProps{
    size: string;
    color: string;
    thickness: string;
    className?: string
}

// Default values are set to mirror a clean, modern design if props aren't provided
const Spinner: React.FC<SpinnerProps> = ({ 
  size = '40px', 
  color = '#10b981', // Matches your success green or any hex code
  thickness = '3px',
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className="animate-spin rounded-full"
        style={{
          width: size,
          height: size,
          borderWidth: thickness,
          borderStyle: 'solid',
          borderColor: `${color} transparent transparent transparent`,
        }}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export default Spinner;