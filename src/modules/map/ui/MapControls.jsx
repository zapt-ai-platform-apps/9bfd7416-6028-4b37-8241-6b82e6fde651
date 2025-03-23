import React from 'react';

/**
 * Component for zoom controls on the map
 * @param {Object} props
 * @param {Function} props.onZoomIn - Function to call when zooming in
 * @param {Function} props.onZoomOut - Function to call when zooming out
 */
const MapControls = ({ onZoomIn, onZoomOut }) => {
  return (
    <div className="map-controls absolute top-2 right-2 z-10 flex space-x-2">
      <button
        className="bg-white rounded-full p-2 shadow-lg cursor-pointer"
        onClick={onZoomIn}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
      <button
        className="bg-white rounded-full p-2 shadow-lg cursor-pointer"
        onClick={onZoomOut}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </div>
  );
};

export default MapControls;