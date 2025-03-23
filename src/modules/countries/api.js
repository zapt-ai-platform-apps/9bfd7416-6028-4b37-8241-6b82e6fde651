import { getCountryByCode, getAllCountries, selectCountry } from './internal/services';

/**
 * Public API for the countries module
 */
export const api = {
  getCountryByCode,
  getAllCountries,
  selectCountry
};