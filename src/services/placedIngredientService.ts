import { StorageService } from './storageService';
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
    const randomString = Math.random().toString(36).substr(2, 9);
    return `placed-${timestamp}-${randomString}`;
  }

  /**
   * Validates if an ingredient can be placed at the given position
   * Checks bounds and collision detection
   */
  static canPlaceIngredient(
    ingredient: Ingredient,
    partition: Partition,
    position: { x: number; y: number },
    existingIngredients: PlacedIngredient[]
  ): PlacementResult {
    // Check if ingredient fits within partition bounds
    const ingredientRight = position.x + ingredient.defaultSize.width;
    const ingredientBottom = position.y + ingredient.defaultSize.height;
    const partitionRight = partition.bounds.x + partition.bounds.width;
    const partitionBottom = partition.bounds.y + partition.bounds.height;

    if (ingredientRight > partitionRight || ingredientBottom > partitionBottom) {
      return {
        canPlace: false,
        reason: 'Ingredient extends beyond partition bounds'
      };
    }

    // Check for overlaps with existing ingredients in the same partition
    const ingredientsInPartition = existingIngredients.filter(
      placed => placed.partitionId === partition.id
    );

    for (const existing of ingredientsInPartition) {
      if (this.isOverlapping(position, ingredient.defaultSize, existing.position, existing.size)) {
        return {
          canPlace: false,
          reason: 'Ingredient overlaps with existing ingredient'
        };
      }
    }

    return { canPlace: true };
  }

  /**
   * Checks if two rectangles overlap using AABB collision detection
   */
  private static isOverlapping(
    pos1: { x: number; y: number },
    size1: { width: number; height: number },
    pos2: { x: number; y: number },
    size2: { width: number; height: number }
  ): boolean {
    return !(
      pos1.x + size1.width <= pos2.x ||   // rect1 is to the left of rect2
      pos2.x + size2.width <= pos1.x ||   // rect2 is to the left of rect1  
      pos1.y + size1.height <= pos2.y ||  // rect1 is above rect2
      pos2.y + size2.height <= pos1.y     // rect2 is above rect1
    );
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