import { describe, it, expect } from 'vitest';
import { validateMapPosition, validateClickPosition } from './validators';

describe('Map Position Validator', () => {
  it('validates a valid map position', () => {
    const validPosition = {
      coordinates: [0, 0],
      zoom: 1
    };
    
    expect(() => validateMapPosition(validPosition, {
      actionName: 'test',
      location: 'test',
      direction: 'test',
      moduleFrom: 'test',
      moduleTo: 'test'
    })).not.toThrow();
  });
  
  it('throws on invalid coordinates', () => {
    const invalidPosition = {
      coordinates: [0], // Should be a tuple of two numbers
      zoom: 1
    };
    
    expect(() => validateMapPosition(invalidPosition, {
      actionName: 'test',
      location: 'test',
      direction: 'test',
      moduleFrom: 'test',
      moduleTo: 'test'
    })).toThrow();
  });
  
  it('throws on negative zoom', () => {
    const invalidPosition = {
      coordinates: [0, 0],
      zoom: -1 // Should be non-negative
    };
    
    expect(() => validateMapPosition(invalidPosition, {
      actionName: 'test',
      location: 'test',
      direction: 'test',
      moduleFrom: 'test',
      moduleTo: 'test'
    })).toThrow();
  });
});

describe('Click Position Validator', () => {
  it('validates a valid click position', () => {
    const validPosition = {
      x: 100,
      y: 200
    };
    
    expect(() => validateClickPosition(validPosition, {
      actionName: 'test',
      location: 'test',
      direction: 'test',
      moduleFrom: 'test',
      moduleTo: 'test'
    })).not.toThrow();
  });
  
  it('throws when coordinates are not numbers', () => {
    const invalidPosition = {
      x: '100', // Should be a number
      y: 200
    };
    
    expect(() => validateClickPosition(invalidPosition, {
      actionName: 'test',
      location: 'test',
      direction: 'test',
      moduleFrom: 'test',
      moduleTo: 'test'
    })).toThrow();
  });
});