import { Ingredient } from '@/types';

/**
 * Color mapping from ingredient color names to actual color codes
 * Colors chosen for good contrast and visual appeal in UI components
 */
export const COLOR_MAP = {
  red: '#E53E3E',      // Vibrant red for tomatoes, strawberries
  yellow: '#F6E05E',   // Bright yellow for eggs, cheese
  green: '#38A169',    // Fresh green for vegetables
  white: '#F7FAFC',    // Clean white for rice, tofu
  brown: '#975A16',    // Rich brown for fried foods
  black: '#2D3748'     // Deep black for seaweed, olives
} as const;

/**
 * Default color used when an ingredient color is not found
 */
export const DEFAULT_COLOR = COLOR_MAP.white;

/**
 * Gets the hex color code for an ingredient color
 * @param color The ingredient color name
 * @returns The corresponding hex color code
 */
export function getColorCode(color: Ingredient['color']): string {
  return COLOR_MAP[color] ?? DEFAULT_COLOR;
}