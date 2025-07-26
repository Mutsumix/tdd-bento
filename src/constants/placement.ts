/**
 * Constants for ingredient placement validation
 */

export const PLACEMENT_ERROR_MESSAGES = {
  EXTENDS_BEYOND_BOUNDS: 'Ingredient extends beyond partition bounds',
  OVERLAPS_WITH_EXISTING: 'Ingredient overlaps with existing ingredient',
} as const;

export const ID_GENERATION = {
  PLACED_INGREDIENT_PREFIX: 'placed',
  RANDOM_STRING_LENGTH: 9,
} as const;