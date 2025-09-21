import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    className={className}
    aria-label="KalaKarvan Logo"
  >
    <defs>
      <radialGradient id="ai-spark-glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="rgba(200, 200, 255, 0.9)" />
        <stop offset="70%" stopColor="rgba(79, 70, 229, 0.5)" />
        <stop offset="100%" stopColor="rgba(49, 46, 129, 0.3)" />
      </radialGradient>
    </defs>
    
    {/* Letter K */}
    <path
      d="M28 90 V 12 C 28 2 12 -2 12 15 S 28 22 28 32 L 28 45 M78 90 L48 51 L75 12"
      fill="none"
      stroke="#E67A56"
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    
    {/* AI Spark */}
    <g transform="translate(48, 51)">
      {/* Outer ring */}
      <circle r="15" fill="none" stroke="#4a55b1" strokeWidth="5" />
      {/* Glow effect */}
      <circle r="15" fill="url(#ai-spark-glow)" />
      {/* Inner dot */}
      <circle r="5" fill="#4a55b1" />
      {/* Center highlight */}
      <circle r="2.5" fill="white" />
    </g>
  </svg>
);

export default Logo;