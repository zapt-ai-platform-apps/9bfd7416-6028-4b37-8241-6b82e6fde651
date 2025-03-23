import { describe, it, expect } from 'vitest';
import { validateCountry } from './validators';

describe('Country Validator', () => {
  it('validates a valid country', () => {
    const validCountry = {
      code: 'US',
      area: 9833517,
      population: 331002651,
      flagUrl: 'https://flagcdn.com/us.svg',
      story: 'A folk story about the United States'
    };
    
    expect(() => validateCountry(validCountry, {
      actionName: 'test',
      location: 'test',
      direction: 'test',
      moduleFrom: 'test',
      moduleTo: 'test'
    })).not.toThrow();
  });
  
  it('throws an error for invalid country data', () => {
    const invalidCountry = {
      code: 'US',
      area: '9833517', // Should be a number
      population: 331002651,
      flagUrl: 'https://flagcdn.com/us.svg',
      story: 'A folk story about the United States'
    };
    
    expect(() => validateCountry(invalidCountry, {
      actionName: 'test',
      location: 'test',
      direction: 'test',
      moduleFrom: 'test',
      moduleTo: 'test'
    })).toThrow();
  });
  
  it('throws an error when required field is missing', () => {
    const invalidCountry = {
      code: 'US',
      area: 9833517,
      population: 331002651,
      // flagUrl is missing
      story: 'A folk story about the United States'
    };
    
    expect(() => validateCountry(invalidCountry, {
      actionName: 'test',
      location: 'test',
      direction: 'test',
      moduleFrom: 'test',
      moduleTo: 'test'
    })).toThrow();
  });
});