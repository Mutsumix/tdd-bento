import { Ingredient, Partition } from '@/types';

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
 * Partition color scheme interface for type safety
 */
export interface PartitionColorScheme {
  backgroundColor: string;
  borderColor: string;
}

/**
 * Color configuration for different partition types
 * Uses consistent color palette with ingredient colors
 */
export const PARTITION_COLORS: Record<Partition['type'], PartitionColorScheme> = {
  rice: {
    backgroundColor: '#ffffff',    // Pure white for rice compartment (brighter than COLOR_MAP.white)
    borderColor: '#e0e0e0'        // Light gray border
  },
  side: {
    backgroundColor: '#f5f5f5',    // Light gray for side dish compartment  
    borderColor: '#d0d0d0'        // Slightly darker gray border
  }
} as const;

/**
 * Japanese color name mapping for UI display
 * Used for suggestion reasons and user-friendly color descriptions
 */
export const COLOR_NAMES_JP = {
  red: '赤',
  yellow: '黄',
  green: '緑', 
  white: '白',
  brown: '茶',
  black: '黒'
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

/**
 * Gets the color configuration for a specific partition type
 * @param partitionType The type of partition ('rice' | 'side')
 * @returns Color configuration object with backgroundColor and borderColor
 */
export function getPartitionColors(partitionType: Partition['type']): PartitionColorScheme {
  return PARTITION_COLORS[partitionType] ?? PARTITION_COLORS.rice;
}

/**
 * Gets the Japanese name for an ingredient color
 * @param color The ingredient color name
 * @returns The corresponding Japanese color name
 */
export function getColorNameJP(color: Ingredient['color']): string {
  return COLOR_NAMES_JP[color] ?? color;
}