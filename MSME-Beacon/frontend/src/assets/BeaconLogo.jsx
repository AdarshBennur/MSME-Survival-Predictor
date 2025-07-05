import React from 'react';

const BeaconLogo = () => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      className="mr-2"
    >
      {/* Base Circle */}
      <circle cx="20" cy="20" r="18" fill="#1E40AF" />
      
      {/* Beacon Light Rays - Animated */}
      <g>
        <path
          d="M20 5 L20 1"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
          className="animate-pulse"
          style={{ animationDelay: '0ms' }}
        />
        <path
          d="M20 39 L20 35"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
          className="animate-pulse"
          style={{ animationDelay: '100ms' }}
        />
        <path
          d="M5 20 L1 20"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
          className="animate-pulse"
          style={{ animationDelay: '200ms' }}
        />
        <path
          d="M39 20 L35 20"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
          className="animate-pulse"
          style={{ animationDelay: '300ms' }}
        />
        <path
          d="M9 9 L6 6"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
          className="animate-pulse"
          style={{ animationDelay: '400ms' }}
        />
        <path
          d="M34 34 L31 31"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
          className="animate-pulse"
          style={{ animationDelay: '500ms' }}
        />
        <path
          d="M9 31 L6 34"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
          className="animate-pulse"
          style={{ animationDelay: '600ms' }}
        />
        <path
          d="M34 6 L31 9"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
          className="animate-pulse"
          style={{ animationDelay: '700ms' }}
        />
      </g>
      
      {/* Beacon Tower */}
      <path
        d="M20 8 L20 32"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
      />
      
      {/* Lighthouse Top */}
      <circle 
        cx="20" 
        cy="8" 
        r="4" 
        fill="#FFFFFF" 
        className="animate-ping"
        style={{ 
          animationDuration: '2s',
          transformOrigin: 'center',
          opacity: 0.8
        }}
      />
      
      {/* Lighthouse Base */}
      <rect
        x="15"
        y="32"
        width="10"
        height="3"
        fill="#FFFFFF"
        rx="1"
      />
    </svg>
  );
};

export default BeaconLogo; 