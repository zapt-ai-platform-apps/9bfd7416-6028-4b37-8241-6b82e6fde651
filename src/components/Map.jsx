import React, { useState, useEffect } from 'react';
import { 
  ComposableMap, 
  Geographies, 
  Geography,
  ZoomableGroup
} from 'react-simple-maps';
import CountryInfo from './CountryInfo';
import { countryData } from '../data/countryData';

// URL to the world map TopoJSON
const WORLD_MAP_URL = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

const Map = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Handle country click
  const handleCountryClick = (geo, event) => {
    const { NAME, ISO_A2 } = geo.properties;
    const country = countryData.find(c => c.code === ISO_A2);
    
    if (country) {
      setSelectedCountry({
        name: NAME,
        code: ISO_A2,
        area: country.area,
        population: country.population,
        flagUrl: country.flagUrl,
        story: country.story
      });
      
      // Set tooltip position relative to click event
      const bounds = event.target.getBoundingClientRect();
      setTooltipPosition({
        x: bounds.left + bounds.width / 2,
        y: bounds.top
      });
    }
  };

  // Handle map zooming
  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom * 2 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom / 2 }));
  };

  const handleMoveEnd = (position) => {
    setPosition(position);
  };

  // Close the country info popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectedCountry && !event.target.closest('.country-info') && 
          !event.target.closest('.rsm-geography')) {
        setSelectedCountry(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [selectedCountry]);

  return (
    <div className="relative w-full h-full">
      <div className="map-controls absolute top-2 right-2 z-10 flex space-x-2">
        <button
          className="bg-white rounded-full p-2 shadow-lg cursor-pointer"
          onClick={handleZoomIn}
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
          onClick={handleZoomOut}
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
      
      <ComposableMap projection="geoMercator" className="w-full">
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
        >
          <defs>
            {countryData.map(country => (
              <pattern
                key={country.code}
                id={country.code}
                patternUnits="userSpaceOnUse"
                width="100%"
                height="100%"
              >
                <image
                  xlinkHref={country.flagUrl}
                  width="100%"
                  height="100%"
                  preserveAspectRatio="xMidYMid slice"
                />
              </pattern>
            ))}
          </defs>
          
          <Geographies geography={WORLD_MAP_URL}>
            {({ geographies }) =>
              geographies.map(geo => {
                const { ISO_A2 } = geo.properties;
                const country = countryData.find(c => c.code === ISO_A2);
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={(event) => handleCountryClick(geo, event)}
                    style={{
                      default: {
                        fill: country ? `url(#${ISO_A2})` : "#D6D6DA",
                        outline: "none"
                      },
                      hover: {
                        fill: country ? `url(#${ISO_A2})` : "#D6D6DA",
                        outline: "none",
                        stroke: "#607D8B",
                        strokeWidth: 1.5
                      },
                      pressed: {
                        fill: country ? `url(#${ISO_A2})` : "#D6D6DA",
                        outline: "none"
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      
      {selectedCountry && (
        <CountryInfo 
          country={selectedCountry} 
          position={tooltipPosition} 
          onClose={() => setSelectedCountry(null)} 
        />
      )}
    </div>
  );
};

export default Map;