import React from 'react';

/**
 * Error state component for the map
 * @param {Object} props
 * @param {string} props.error - Error message to display
 */
const MapError = ({ error }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
        <h2 className="text-lg font-semibold mb-2">Unable to load map</h2>
        <p>{error}</p>
      </div>
      <button 
        onClick={() => window.location.reload()}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
      >
        Try Again
      </button>
    </div>
  );
};

export default MapError;