import { z } from 'zod';
import { createValidator } from '@/modules/core/validators';

/**
 * Schema for map position data
 */
export const mapPositionSchema = z.object({
  coordinates: z.tuple([z.number(), z.number()]),
  zoom: z.number().min(0)
});

/**
 * Schema for click position data
 */
export const clickPositionSchema = z.object({
  x: z.number(),
  y: z.number()
});

/**
 * Validator functions for map-related data
 */
export const validateMapPosition = createValidator(mapPositionSchema, 'MapPosition');
export const validateClickPosition = createValidator(clickPositionSchema, 'ClickPosition');