
import React from 'react';

const LoaderIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`${className} animate-spin`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.75V6.25m0 11.5v1.5m7.121-8.121 1.061-1.061M4.818 19.182l1.06-1.06M19.243 4.757l-1.061 1.061M6.879 6.879 5.818 5.818M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
  </svg>
);

export default LoaderIcon;
