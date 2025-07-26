import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ingredient, PlacedIngredient } from '@/types';

// Storage keys
const STORAGE_KEYS = {
  USER_INGREDIENTS: 'user_ingredients',
  BENTO_STATE: 'bento_state',
} as const;

export class StorageService {
  /**
   * Generic save method for any data type
   */
  private static async saveData<T>(key: string, data: T): Promise<void> {
    const jsonData = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonData);
  }

  /**
   * Generic load method for any data type with graceful error handling
   */
  private static async loadData<T>(key: string): Promise<T[]> {
    const jsonData = await AsyncStorage.getItem(key);
    
    if (jsonData === null) {
      return [];
    }

    try {
      return JSON.parse(jsonData) as T[];
    } catch (error) {
      // Handle corrupted data gracefully by returning empty array
      if (error instanceof SyntaxError) {
        return [];
      }
      throw error;
    }
  }

  /**
   * Save user-added ingredients to AsyncStorage
   */
  static async saveUserIngredients(ingredients: Ingredient[]): Promise<void> {
    await this.saveData(STORAGE_KEYS.USER_INGREDIENTS, ingredients);
  }

  /**
   * Load user-added ingredients from AsyncStorage
   */
  static async loadUserIngredients(): Promise<Ingredient[]> {
    return this.loadData<Ingredient>(STORAGE_KEYS.USER_INGREDIENTS);
  }

  /**
   * Add a new user ingredient
   */
  static async addUserIngredient(ingredient: Ingredient): Promise<void> {
    const existingIngredients = await this.loadUserIngredients();
    const updatedIngredients = [...existingIngredients, ingredient];
    await this.saveUserIngredients(updatedIngredients);
  }

  /**
   * Remove a user ingredient by ID
   */
  static async removeUserIngredient(ingredientId: string): Promise<void> {
    const existingIngredients = await this.loadUserIngredients();
    const filteredIngredients = existingIngredients.filter(
      ingredient => ingredient.id !== ingredientId
    );
    await this.saveUserIngredients(filteredIngredients);
  }

  /**
   * Save bento state (placed ingredients) to AsyncStorage
   */
  static async saveBentoState(placedIngredients: PlacedIngredient[]): Promise<void> {
    await this.saveData(STORAGE_KEYS.BENTO_STATE, placedIngredients);
  }

  /**
   * Load bento state (placed ingredients) from AsyncStorage
   */
  static async loadBentoState(): Promise<PlacedIngredient[]> {
    return this.loadData<PlacedIngredient>(STORAGE_KEYS.BENTO_STATE);
  }

  /**
   * Clear bento state from AsyncStorage
   */
  static async clearBentoState(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.BENTO_STATE);
  }
}