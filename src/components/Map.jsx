import React, { useState, useEffect, useRef } from 'react';
import { 
  ComposableMap, 
  Geographies, 
  Geography,
  ZoomableGroup
} from 'react-simple-maps';
import CountryInfo from './CountryInfo';
import { countryData } from '../data/countryData';
import ErrorBoundary from './ErrorBoundary';

// URL to the world map TopoJSON
const WORLD_MAP_URL = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

const Map = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const mapContainer = useRef(null);

  // Preload the map data to check for errors
  useEffect(() => {
    console.log("Fetching map data from:", WORLD_MAP_URL);
    setIsLoading(true);
    
    fetch(WORLD_MAP_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load map data: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Map data loaded successfully");
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error loading map data:", error);
        setMapError(error.message);
        setIsLoading(false);
      });
  }, []);

  // Handle country click
  const handleCountryClick = (geo, event) => {
    const { NAME, ISO_A2 } = geo.properties;
    const country = countryData.find(c => c.code === ISO_A2);
    
    if (country) {
      console.log(`Selected country: ${NAME} (${ISO_A2})`);
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

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-700 text-lg">Loading world map...</p>
      </div>
    );
  }

  // Error state
  if (mapError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          <h2 className="text-lg font-semibold mb-2">Unable to load map</h2>
          <p>{mapError}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full" ref={mapContainer}>
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
      
      <ErrorBoundary fallback={<div className="p-4 text-red-600">Something went wrong with the map. Please try refreshing the page.</div>}>
        <ComposableMap projection="geoMercator" className="w-full h-full">
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
      </ErrorBoundary>
      
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