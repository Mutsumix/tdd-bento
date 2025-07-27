import { Ingredient } from '@/types';
import { getInitialIngredients } from '@/data/initialIngredients';
import { StorageService } from './StorageService';

/**
 * Service for managing ingredient data operations
 * Handles lookups and provides access to ingredient information
 */
export class IngredientService {
  // Cache the initial ingredients to avoid repeated function calls
  private static ingredients: Ingredient[] = getInitialIngredients();
  private static userIngredients: Ingredient[] = [];

  /**
   * Initialize service with provided ingredients (for testing)
   */
  static initializeForTesting(initialIngredients: Ingredient[] = getInitialIngredients()): void {
    this.ingredients = initialIngredients;
    this.userIngredients = [];
  }
  
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

  /**
   * Creates a new user ingredient with generated ID and default values
   * @param ingredientData Partial ingredient data
   * @returns Complete ingredient object
   */
  static createUserIngredient(ingredientData: Omit<Ingredient, 'id' | 'defaultSize' | 'icon'>): Ingredient {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substr(2, 9);
    const id = `user-ingredient-${timestamp}-${randomString}`;
    
    return {
      ...ingredientData,
      id,
      defaultSize: { width: 40, height: 30 },
      icon: 'circle',
    };
  }

  /**
   * Adds a new user ingredient and saves to storage
   * @param ingredientData Partial ingredient data
   * @returns The created ingredient
   */
  static async addUserIngredient(ingredientData: Omit<Ingredient, 'id' | 'defaultSize' | 'icon'>): Promise<Ingredient> {
    const newIngredient = this.createUserIngredient(ingredientData);
    
    // Add to cache
    this.userIngredients.push(newIngredient);
    
    // Save to storage
    await StorageService.addUserIngredient(newIngredient);
    
    return newIngredient;
  }

  /**
   * Gets all ingredients including user-added ones
   * @returns Combined array of initial and user ingredients
   */
  static async getAllWithUserIngredients(): Promise<Ingredient[]> {
    return [...this.ingredients, ...this.userIngredients];
  }

  /**
   * Loads user ingredients from storage
   */
  static async loadUserIngredients(): Promise<void> {
    this.userIngredients = await StorageService.loadUserIngredients();
  }

  /**
   * Async version of findById that searches both initial and user ingredients
   * @param id The ingredient ID to search for
   * @returns The found ingredient or null
   */
  static async findByIdAsync(id: string): Promise<Ingredient | null> {
    // Search in initial ingredients
    const initialIngredient = this.findById(id);
    if (initialIngredient) {
      return initialIngredient;
    }
    
    // Search in user ingredients
    return this.userIngredients.find((ingredient: Ingredient) => ingredient.id === id) || null;
  }
}