import { Size } from '@/utils/collision';

/**
 * Sizing configuration for PlacedIngredientItem
 */
export const SIZING_CONFIG = {
  // Minimum sizes
  MIN_ICON_SIZE: 8,
  MIN_FONT_SIZE: 6,
  
  // Maximum sizes
  MAX_ICON_SIZE: 24,
  MAX_FONT_SIZE: 12,
  
  // Ratios relative to container size
  ICON_SIZE_RATIO: 0.4,      // Icon takes 40% of container height
  FONT_SIZE_RATIO: 0.2,      // Font size is 20% of container height
  
  // Padding and margins
  CONTENT_PADDING: 2,
  ICON_MARGIN_BOTTOM: 2,
} as const;

/**
 * Calculates appropriate icon size based on container dimensions
 * @param containerSize The size of the container
 * @returns The calculated icon size
 */
export function calculateIconSize(containerSize: Size): number {
  const calculatedSize = Math.min(containerSize.width, containerSize.height) * SIZING_CONFIG.ICON_SIZE_RATIO;
  return Math.max(
    SIZING_CONFIG.MIN_ICON_SIZE,
    Math.min(SIZING_CONFIG.MAX_ICON_SIZE, Math.round(calculatedSize))
  );
}

/**
 * Calculates appropriate font size based on container dimensions
 * @param containerSize The size of the container
 * @returns The calculated font size
 */
export function calculateFontSize(containerSize: Size): number {
  const calculatedSize = Math.min(containerSize.width, containerSize.height) * SIZING_CONFIG.FONT_SIZE_RATIO;
  return Math.max(
    SIZING_CONFIG.MIN_FONT_SIZE,
    Math.min(SIZING_CONFIG.MAX_FONT_SIZE, Math.round(calculatedSize))
  );
}