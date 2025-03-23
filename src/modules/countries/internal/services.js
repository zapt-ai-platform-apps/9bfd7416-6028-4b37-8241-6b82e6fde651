import { countryData as data1 } from './data';
import { countryData as data2 } from './data2';
import { countryData as data3 } from './data3';
import { validateCountry } from '../validators';
import { eventBus } from '@/modules/core/events';
import { events } from '../events';

// Combine all country data
const allCountryData = [...data1, ...data2, ...data3];

/**
 * Get a country by its ISO code
 * @param {string} code - The ISO country code
 * @returns {Object|null} - The country object or null if not found
 */
export const getCountryByCode = (code) => {
  const country = allCountryData.find(c => c.code === code);
  
  if (!country) {
    console.log(`Country with code ${code} not found`);
    return null;
  }
  
  return validateCountry(country, {
    actionName: 'getCountryByCode',
    location: 'countries/internal/services.js',
    direction: 'outgoing',
    moduleFrom: 'countries',
    moduleTo: 'client'
  });
};

/**
 * Get all countries
 * @returns {Array} - Array of country objects
 */
export const getAllCountries = () => {
  console.log(`Retrieving all ${allCountryData.length} countries`);
  
  return allCountryData.map(country => 
    validateCountry(country, {
      actionName: 'getAllCountries',
      location: 'countries/internal/services.js',
      direction: 'outgoing',
      moduleFrom: 'countries',
      moduleTo: 'client'
    })
  );
};

/**
 * Select a country and publish a country selected event
 * @param {string} code - The ISO country code
 * @param {Object} position - The position where the country was clicked
 */
export const selectCountry = (code, position) => {
  const country = getCountryByCode(code);
  
  if (country) {
    console.log(`Selected country: ${country.name || code}`);
    
    eventBus.publish(events.COUNTRY_SELECTED, {
      country,
      position
    });
    
    return country;
  }
  
  return null;
};