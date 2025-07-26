import { Ingredient } from '@/types';
import { getInitialIngredients } from '@/data/initialIngredients';

/**
 * Service for managing ingredient data operations
 * Handles lookups and provides access to ingredient information
 */
export class IngredientService {
  // Cache the initial ingredients to avoid repeated function calls
  private static ingredients: Ingredient[] = getInitialIngredients();
  
  /**
   * Finds an ingredient by its ID
   * @param id The ingredient ID to search for
   * @returns The found ingredient or null if not found
   */
  static findById(id: string): Ingredient | null {
    return this.ingredients.find((ingredient: Ingredient) => ingredient.id === id) || null;
  }

  /**
   * Gets all available ingredients
   * @returns Array of all ingredients
   */
  static getAll(): Ingredient[] {
    return [...this.ingredients];
  }

  /**
   * Finds ingredients by category
   * @param category The category to filter by
   * @returns Array of ingredients in the specified category
   */
  static findByCategory(category: Ingredient['category']): Ingredient[] {
    return this.ingredients.filter((ingredient: Ingredient) => ingredient.category === category);
  }

  /**
   * Finds ingredients by color
   * @param color The color to filter by
   * @returns Array of ingredients with the specified color
   */
  static findByColor(color: Ingredient['color']): Ingredient[] {
    return this.ingredients.filter((ingredient: Ingredient) => ingredient.color === color);
  }
}