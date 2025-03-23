import React, { useState, useEffect, useRef } from 'react';
import { 
  ComposableMap, 
  Geographies, 
  Geography,
  ZoomableGroup
} from 'react-simple-maps';
import { validateMapPosition, validateClickPosition } from '../validators';
import { api as countriesApi } from '@/modules/countries/api';
import CountryInfo from '@/modules/countries/ui/CountryInfo';
import MapControls from './MapControls';
import MapLoading from './MapLoading';
import MapError from './MapError';
import ErrorBoundary from '@/modules/core/ui/ErrorBoundary';
import { eventBus } from '@/modules/core/events';
import { events as mapEvents } from '../events';

// URL to the world map TopoJSON
const WORLD_MAP_URL = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

/**
 * Main interactive world map component
 */
const WorldMap = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const mapContainer = useRef(null);
  const countries = countriesApi.getAllCountries();

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
    const country = countries.find(c => c.code === ISO_A2);
    
    if (country) {
      console.log(`Selected country: ${NAME} (${ISO_A2})`);
      setSelectedCountry({
        ...country,
        name: NAME,
      });
      
      // Set tooltip position relative to click event
      const bounds = event.target.getBoundingClientRect();
      const clickPosition = validateClickPosition({
        x: bounds.left + bounds.width / 2,
        y: bounds.top
      }, {
        actionName: 'handleCountryClick',
        location: 'map/ui/WorldMap.jsx',
        direction: 'internal',
        moduleFrom: 'map',
        moduleTo: 'map'
      });
      
      setTooltipPosition(clickPosition);
      
      // Publish event
      eventBus.publish(mapEvents.MAP_COUNTRY_CLICKED, {
        countryCode: ISO_A2,
        countryName: NAME,
        position: clickPosition
      });
    }
  };

  // Handle map zooming
  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    const newPosition = { ...position, zoom: position.zoom * 2 };
    setPosition(newPosition);
    
    // Publish event
    eventBus.publish(mapEvents.MAP_ZOOM_CHANGED, {
      zoom: newPosition.zoom
    });
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    const newPosition = { ...position, zoom: position.zoom / 2 };
    setPosition(newPosition);
    
    // Publish event
    eventBus.publish(mapEvents.MAP_ZOOM_CHANGED, {
      zoom: newPosition.zoom
    });
  };

  const handleMoveEnd = (newPosition) => {
    try {
      const validatedPosition = validateMapPosition(newPosition, {
        actionName: 'handleMoveEnd',
        location: 'map/ui/WorldMap.jsx',
        direction: 'internal',
        moduleFrom: 'map',
        moduleTo: 'map'
      });
      
      setPosition(validatedPosition);
      
      // Publish event
      eventBus.publish(mapEvents.MAP_POSITION_CHANGED, validatedPosition);
    } catch (error) {
      console.error("Invalid map position:", error);
    }
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
    return <MapLoading />;
  }

  // Error state
  if (mapError) {
    return <MapError error={mapError} />;
  }

  return (
    <div className="relative w-full h-full" ref={mapContainer}>
      <MapControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
      
      <ErrorBoundary fallback={<div className="p-4 text-red-600">Something went wrong with the map. Please try refreshing the page.</div>}>
        <ComposableMap projection="geoMercator" className="w-full h-full">
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={handleMoveEnd}
          >
            <defs>
              {countries.map(country => (
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
                  const country = countries.find(c => c.code === ISO_A2);
                  
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

export default WorldMap;