import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ingredient, PlacedIngredient } from '@/types';

// Storage keys
const STORAGE_KEYS = {
  USER_INGREDIENTS: 'user_ingredients',
  BENTO_STATE: 'bento_state',
} as const;

export class StorageService {
  /**
   * Save user-added ingredients to AsyncStorage
   */
  static async saveUserIngredients(ingredients: Ingredient[]): Promise<void> {
    try {
      const jsonData = JSON.stringify(ingredients);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_INGREDIENTS, jsonData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Load user-added ingredients from AsyncStorage
   */
  static async loadUserIngredients(): Promise<Ingredient[]> {
    try {
      const jsonData = await AsyncStorage.getItem(STORAGE_KEYS.USER_INGREDIENTS);
      
      if (jsonData === null) {
        return [];
      }

      const ingredients = JSON.parse(jsonData) as Ingredient[];
      return ingredients;
    } catch (error) {
      // Handle corrupted data gracefully
      if (error instanceof SyntaxError) {
        return [];
      }
      throw error;
    }
  }

  /**
   * Add a new user ingredient
   */
  static async addUserIngredient(ingredient: Ingredient): Promise<void> {
    try {
      const existingIngredients = await this.loadUserIngredients();
      const updatedIngredients = [...existingIngredients, ingredient];
      await this.saveUserIngredients(updatedIngredients);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove a user ingredient by ID
   */
  static async removeUserIngredient(ingredientId: string): Promise<void> {
    try {
      const existingIngredients = await this.loadUserIngredients();
      const filteredIngredients = existingIngredients.filter(
        ingredient => ingredient.id !== ingredientId
      );
      await this.saveUserIngredients(filteredIngredients);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Save bento state (placed ingredients) to AsyncStorage
   */
  static async saveBentoState(placedIngredients: PlacedIngredient[]): Promise<void> {
    try {
      const jsonData = JSON.stringify(placedIngredients);
      await AsyncStorage.setItem(STORAGE_KEYS.BENTO_STATE, jsonData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Load bento state (placed ingredients) from AsyncStorage
   */
  static async loadBentoState(): Promise<PlacedIngredient[]> {
    try {
      const jsonData = await AsyncStorage.getItem(STORAGE_KEYS.BENTO_STATE);
      
      if (jsonData === null) {
        return [];
      }

      const placedIngredients = JSON.parse(jsonData) as PlacedIngredient[];
      return placedIngredients;
    } catch (error) {
      // Handle corrupted data gracefully
      if (error instanceof SyntaxError) {
        return [];
      }
      throw error;
    }
  }

  /**
   * Clear bento state from AsyncStorage
   */
  static async clearBentoState(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.BENTO_STATE);
    } catch (error) {
      throw error;
    }
  }
}