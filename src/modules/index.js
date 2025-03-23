import { api as coreApi } from './core/api';
import { api as countriesApi } from './countries/api';
import { api as mapApi } from './map/api';

/**
 * Initialize all modules in the application
 * Should be called once at application startup
 */
export async function initializeModules() {
  console.log('Initializing modules...');
  // Add any module initialization here if needed
  console.log('Modules initialized successfully');
  
  return {
    core: coreApi,
    countries: countriesApi,
    map: mapApi
  };
}