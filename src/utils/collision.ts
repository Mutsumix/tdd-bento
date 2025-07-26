/**
 * Collision detection utilities for rectangular objects
 */

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

/**
 * Checks if two rectangles overlap using AABB (Axis-Aligned Bounding Box) collision detection
 * Returns true if rectangles overlap, false if they're completely separated
 */
export function isOverlapping(
  pos1: Position,
  size1: Size,
  pos2: Position,
  size2: Size
): boolean {
  return !(
    pos1.x + size1.width <= pos2.x ||   // rect1 is to the left of rect2
    pos2.x + size2.width <= pos1.x ||   // rect2 is to the left of rect1  
    pos1.y + size1.height <= pos2.y ||  // rect1 is above rect2
    pos2.y + size2.height <= pos1.y     // rect2 is above rect1
  );
}

/**
 * Checks if a rectangle fits within the bounds of another rectangle
 * This matches the original BentoBoxCanvas validation logic
 */
export function fitsWithinBounds(
  position: Position,
  size: Size,
  bounds: Rectangle
): boolean {
  const right = position.x + size.width;
  const bottom = position.y + size.height;
  const boundsRight = bounds.x + bounds.width;
  const boundsBottom = bounds.y + bounds.height;

  return right <= boundsRight && bottom <= boundsBottom;
}