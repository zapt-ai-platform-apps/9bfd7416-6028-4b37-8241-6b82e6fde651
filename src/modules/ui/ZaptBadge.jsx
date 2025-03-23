import React from 'react';

/**
 * Component for displaying the "Made on ZAPT" badge
 */
const ZaptBadge = () => {
  return (
    <a 
      href="https://www.zapt.ai" 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-4 left-4 bg-white text-gray-800 rounded-full px-3 py-1 text-sm font-medium shadow-md z-50 transition-all hover:shadow-lg"
    >
      Made on ZAPT
    </a>
  );
};

export default ZaptBadge;