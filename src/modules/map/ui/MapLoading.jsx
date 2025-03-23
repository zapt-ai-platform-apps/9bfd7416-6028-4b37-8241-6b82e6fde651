import React from 'react';

/**
 * Loading state component for the map
 */
const MapLoading = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-700 text-lg">Loading world map...</p>
    </div>
  );
};

export default MapLoading;