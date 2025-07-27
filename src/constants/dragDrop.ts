/**
 * Constants for drag and drop operations
 */

export const DRAG_DROP_ERRORS = {
  PLACEMENT_FAILED: 'Failed to place ingredient',
  STORAGE_LOAD_FAILED: 'Failed to load data',
  STORAGE_SAVE_FAILED: 'Failed to save placed ingredients',
  CLEAR_FAILED: 'Failed to clear placed ingredients',
} as const;

export const DRAG_DROP_CONFIG = {
  // Maximum time to wait for drag operations to complete (ms)
  DRAG_TIMEOUT: 5000,
  
  // Minimum distance required to initiate drag (pixels)
  DRAG_THRESHOLD: 10,
  
  // Animation duration for drop completion (ms)
  DROP_ANIMATION_DURATION: 200,
} as const;

export type DragDropError = typeof DRAG_DROP_ERRORS[keyof typeof DRAG_DROP_ERRORS];