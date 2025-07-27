import { Ingredient, PlacedIngredient, Partition } from '@/types';
import { DropInfo } from '@/components/BentoBoxCanvas/BentoBoxCanvas';

/**
 * Validation result for drop operations
 */
export interface DropValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates if a drop operation is allowed
 */
export function validateDrop(
  ingredient: Ingredient,
  dropInfo: DropInfo,
  existingIngredients: PlacedIngredient[],
  partitions: Partition[]
): DropValidationResult {
  // Check if dropInfo is provided
  if (!dropInfo || !dropInfo.partitionId || !dropInfo.position) {
    return {
      isValid: false,
      error: 'Invalid drop information provided'
    };
  }

  // Check if partition exists
  const targetPartition = partitions.find(p => p.id === dropInfo.partitionId);
  if (!targetPartition) {
    return {
      isValid: false,
      error: `Partition ${dropInfo.partitionId} not found`
    };
  }

  // Check if ingredient would fit within partition bounds
  const { position } = dropInfo;
  const { width, height } = ingredient.defaultSize;
  const partitionBounds = targetPartition.bounds;

  if (
    position.x < partitionBounds.x ||
    position.y < partitionBounds.y ||
    position.x + width > partitionBounds.x + partitionBounds.width ||
    position.y + height > partitionBounds.y + partitionBounds.height
  ) {
    return {
      isValid: false,
      error: 'Ingredient would extend beyond partition boundaries'
    };
  }

  // Check for overlaps with existing ingredients in the same partition
  const ingredientsInPartition = existingIngredients.filter(
    placed => placed.partitionId === dropInfo.partitionId
  );

  for (const existing of ingredientsInPartition) {
    if (isOverlapping(position, ingredient.defaultSize, existing.position, existing.size)) {
      return {
        isValid: false,
        error: 'Ingredient would overlap with existing ingredient'
      };
    }
  }

  return { isValid: true };
}

/**
 * Checks if two rectangles overlap
 */
function isOverlapping(
  pos1: { x: number; y: number },
  size1: { width: number; height: number },
  pos2: { x: number; y: number },
  size2: { width: number; height: number }
): boolean {
  return !(
    pos1.x + size1.width <= pos2.x ||
    pos2.x + size2.width <= pos1.x ||
    pos1.y + size1.height <= pos2.y ||
    pos2.y + size2.height <= pos1.y
  );
}