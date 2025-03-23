import React from 'react';

/**
 * Component for displaying detailed country information
 * @param {Object} props
 * @param {Object} props.country - Country data object
 * @param {Object} props.position - Position to display the popup
 * @param {Function} props.onClose - Function to call when closing the popup
 */
const CountryInfo = ({ country, position, onClose }) => {
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div 
      className="country-info absolute z-20 bg-white rounded-lg shadow-xl p-4 max-w-md"
      style={{
        left: `${position.x}px`,
        top: `${position.y + 20}px`,
        transform: 'translate(-50%, 0)',
      }}
    >
      <button 
        className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-gray-700"
        onClick={onClose}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <div className="flex items-center mb-4">
        <img 
          src={country.flagUrl} 
          alt={`${country.name} flag`} 
          className="w-12 h-8 mr-3 border border-gray-200"
        />
        <h2 className="text-xl font-bold">{country.name}</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="text-sm text-gray-500">Population</h3>
          <p className="font-medium">{formatNumber(country.population)}</p>
        </div>
        <div>
          <h3 className="text-sm text-gray-500">Area</h3>
          <p className="font-medium">{formatNumber(country.area)} km²</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm text-gray-500 mb-1">Folk Story</h3>
        <p className="text-sm">{country.story}</p>
      </div>
    </div>
  );
};

export default CountryInfo;