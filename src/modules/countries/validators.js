import { z } from 'zod';
import { createValidator } from '@/modules/core/validators';

/**
 * Schema for validating country data
 */
export const countrySchema = z.object({
  code: z.string(),
  name: z.string().optional(),
  area: z.number(),
  population: z.number(),
  flagUrl: z.string().url(),
  story: z.string()
});

/**
 * Validator function for country data
 */
export const validateCountry = createValidator(countrySchema, 'Country');