import React from 'react';

const EyeOffIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a10.007 10.007 0 011.336-3.414M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c-1.274 4.057-5.064 7-9.543 7a9.97 9.97 0 01-2.521-.353M3.75 5.25A9.954 9.954 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.01 10.01 0 01-1.625 3.423M3 3l18 18" />
    </svg>
);

export default EyeOffIcon;