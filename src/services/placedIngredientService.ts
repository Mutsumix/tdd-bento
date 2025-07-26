import { StorageService } from './storageService';
import { isOverlapping, fitsWithinBounds, Position, Size } from '@/utils/collision';
import { PLACEMENT_ERROR_MESSAGES, ID_GENERATION } from '@/constants/placement';
import { 
  PlacedIngredient, 
  CreatePlacedIngredientInput, 
  PlacementResult,
  Ingredient,
  Partition
} from '@/types';

/**
 * Service for managing placed ingredients in bento boxes
 * Handles creation, validation, persistence, and management operations
 */
export class PlacedIngredientService {
  
  /**
   * Creates a new PlacedIngredient with a unique generated ID
   */
  static createPlacedIngredient(input: CreatePlacedIngredientInput): PlacedIngredient {
    const id = this.generatePlacedIngredientId();
    
    return {
      id,
      ingredientId: input.ingredientId,
      partitionId: input.partitionId,
      position: input.position,
      size: input.size
    };
  }

  /**
   * Generates a unique ID for a placed ingredient
   * Format: placed-{timestamp}-{randomString}
   */
  private static generatePlacedIngredientId(): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substr(2, ID_GENERATION.RANDOM_STRING_LENGTH);
    return `${ID_GENERATION.PLACED_INGREDIENT_PREFIX}-${timestamp}-${randomString}`;
  }

  /**
   * Validates if an ingredient can be placed at the given position
   * Checks bounds and collision detection
   */
  static canPlaceIngredient(
    ingredient: Ingredient,
    partition: Partition,
    position: Position,
    existingIngredients: PlacedIngredient[]
  ): PlacementResult {
    // Check bounds validation first
    const boundsValidation = this.validateBounds(ingredient, partition, position);
    if (!boundsValidation.canPlace) {
      return boundsValidation;
    }

    // Check collision validation
    const collisionValidation = this.validateCollisions(ingredient, partition, position, existingIngredients);
    if (!collisionValidation.canPlace) {
      return collisionValidation;
    }

    return { canPlace: true };
  }

  /**
   * Validates if ingredient fits within partition bounds
   */
  private static validateBounds(
    ingredient: Ingredient,
    partition: Partition,
    position: Position
  ): PlacementResult {
    const fits = fitsWithinBounds(
      position,
      ingredient.defaultSize,
      partition.bounds
    );

    if (!fits) {
      return {
        canPlace: false,
        reason: PLACEMENT_ERROR_MESSAGES.EXTENDS_BEYOND_BOUNDS
      };
    }

    return { canPlace: true };
  }

  /**
   * Validates if ingredient overlaps with existing ingredients in the same partition
   */
  private static validateCollisions(
    ingredient: Ingredient,
    partition: Partition,
    position: Position,
    existingIngredients: PlacedIngredient[]
  ): PlacementResult {
    const ingredientsInPartition = this.getByPartition(existingIngredients, partition.id);

    for (const existing of ingredientsInPartition) {
      if (isOverlapping(position, ingredient.defaultSize, existing.position, existing.size)) {
        return {
          canPlace: false,
          reason: PLACEMENT_ERROR_MESSAGES.OVERLAPS_WITH_EXISTING
        };
      }
    }

    return { canPlace: true };
  }

  /**
   * Saves placed ingredients to persistent storage
   */
  static async saveToStorage(placedIngredients: PlacedIngredient[]): Promise<void> {
    await StorageService.saveBentoState(placedIngredients);
  }

  /**
   * Loads placed ingredients from persistent storage
   */
  static async loadFromStorage(): Promise<PlacedIngredient[]> {
    return await StorageService.loadBentoState();
  }

  /**
   * Adds a placed ingredient to the collection (immutable)
   */
  static addPlacedIngredient(
    existingIngredients: PlacedIngredient[],
    newIngredient: PlacedIngredient
  ): PlacedIngredient[] {
    return [...existingIngredients, newIngredient];
  }

  /**
   * Removes a placed ingredient by ID (immutable)
   */
  static removePlacedIngredient(
    ingredients: PlacedIngredient[],
    ingredientId: string
  ): PlacedIngredient[] {
    return ingredients.filter(ingredient => ingredient.id !== ingredientId);
  }

  /**
   * Gets all placed ingredients for a specific partition
   */
  static getByPartition(
    ingredients: PlacedIngredient[],
    partitionId: string
  ): PlacedIngredient[] {
    return ingredients.filter(ingredient => ingredient.partitionId === partitionId);
  }
}