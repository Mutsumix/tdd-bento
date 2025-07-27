import { Ingredient } from '@/types';

// Suggestion algorithm types
export type SuggestionType = 'speed' | 'nutrition';

export interface SuggestionResult {
  ingredient: Ingredient;
  score: number;
  reason: string;
}

// Configuration constants for suggestion algorithms
const SUGGESTION_CONFIG = {
  NUTRITION: {
    IDEAL_VALUE: 100,           // Ideal total for each nutrient
    THRESHOLDS: {
      HIGH: 150,                // High nutrition threshold
      BALANCED: 100,            // Balanced nutrition threshold
      MODERATE: 50              // Moderate nutrition threshold
    }
  },
  SPEED: {
    FROZEN_BONUS: 50,          // Bonus points for frozen ingredients
    READY_BONUS: 50            // Bonus points for ready-to-eat ingredients
  }
} as const;

export class SuggestionService {
  /**
   * Calculate speed-focused score for an ingredient
   * Formula: score = (isFrozen ? 50 : 0) + (isReadyToEat ? 50 : 0) - cookingTime
   */
  static calculateSpeedScore(ingredient: Ingredient): number {
    const frozenBonus = ingredient.isFrozen ? SUGGESTION_CONFIG.SPEED.FROZEN_BONUS : 0;
    const readyBonus = ingredient.isReadyToEat ? SUGGESTION_CONFIG.SPEED.READY_BONUS : 0;
    const cookingPenalty = ingredient.cookingTime;
    
    return frozenBonus + readyBonus - cookingPenalty;
  }

  /**
   * Get ingredient suggestions sorted by speed score (highest first)
   */
  static getSuggestionsForSpeed(ingredients: Ingredient[], count?: number): Ingredient[] {
    if (ingredients.length === 0) {
      return [];
    }

    const sorted = [...ingredients].sort((a, b) => {
      const scoreA = this.calculateSpeedScore(a);
      const scoreB = this.calculateSpeedScore(b);
      return scoreB - scoreA; // Descending order (highest score first)
    });

    return count ? sorted.slice(0, count) : sorted;
  }

  /**
   * Calculate nutrition balance score for ingredient combination
   * Formula: each nutrient total close to 100 = higher score
   * vitaminScore = 100 - |totalVitamin - 100|
   * proteinScore = 100 - |totalProtein - 100|
   * fiberScore = 100 - |totalFiber - 100|
   * score = (vitaminScore + proteinScore + fiberScore) / 3
   */
  static calculateNutritionScore(ingredients: Ingredient[]): number {
    if (ingredients.length === 0) {
      return 0;
    }

    // Calculate total nutrition from all ingredients
    const totalNutrition = ingredients.reduce(
      (total, ingredient) => ({
        vitamin: total.vitamin + ingredient.nutrition.vitamin,
        protein: total.protein + ingredient.nutrition.protein,
        fiber: total.fiber + ingredient.nutrition.fiber
      }),
      { vitamin: 0, protein: 0, fiber: 0 }
    );

    const idealValue = SUGGESTION_CONFIG.NUTRITION.IDEAL_VALUE;
    
    // Calculate individual nutrient scores (closer to ideal value = better)
    const vitaminScore = 100 - Math.abs(totalNutrition.vitamin - idealValue);
    const proteinScore = 100 - Math.abs(totalNutrition.protein - idealValue);
    const fiberScore = 100 - Math.abs(totalNutrition.fiber - idealValue);

    // Return average score
    return (vitaminScore + proteinScore + fiberScore) / 3;
  }

  /**
   * Get ingredient suggestions sorted by nutrition balance score (highest first)
   */
  static getSuggestionsForNutrition(ingredients: Ingredient[], count?: number): Ingredient[] {
    if (ingredients.length === 0) {
      return [];
    }

    // For individual ingredients, calculate their contribution to nutrition balance
    const sorted = [...ingredients].sort((a, b) => {
      const scoreA = this.calculateNutritionScore([a]);
      const scoreB = this.calculateNutritionScore([b]);
      return scoreB - scoreA; // Descending order (highest score first)
    });

    return count ? sorted.slice(0, count) : sorted;
  }

  /**
   * Get ingredient suggestions with their scores and reasons
   */
  static getSuggestionsWithScores(ingredients: Ingredient[], type: SuggestionType): SuggestionResult[] {
    const scoreCalculators = {
      speed: (ingredient: Ingredient) => this.calculateSpeedScore(ingredient),
      nutrition: (ingredient: Ingredient) => this.calculateNutritionScore([ingredient])
    };

    const reasonGenerators = {
      speed: (ingredient: Ingredient) => this.getSpeedReason(ingredient),
      nutrition: (ingredient: Ingredient) => this.getNutritionReason(ingredient)
    };

    const scoreCalculator = scoreCalculators[type];
    const reasonGenerator = reasonGenerators[type];

    if (!scoreCalculator || !reasonGenerator) {
      throw new Error(`Unsupported suggestion type: ${type}`);
    }

    const results = ingredients.map(ingredient => ({
      ingredient,
      score: scoreCalculator(ingredient),
      reason: reasonGenerator(ingredient)
    }));

    // Sort by score (highest first)
    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Generate reason text for speed score
   */
  private static getSpeedReason(ingredient: Ingredient): string {
    const isFrozen = ingredient.isFrozen;
    const isReady = ingredient.isReadyToEat;
    
    if (isFrozen && isReady) {
      return 'frozen + ready-to-eat';
    } else if (isReady) {
      return 'ready-to-eat';
    } else if (isFrozen) {
      return 'frozen';
    } else {
      return 'needs cooking';
    }
  }

  /**
   * Generate reason text for nutrition balance score
   */
  private static getNutritionReason(ingredient: Ingredient): string {
    const nutrition = ingredient.nutrition;
    const total = nutrition.vitamin + nutrition.protein + nutrition.fiber;
    const thresholds = SUGGESTION_CONFIG.NUTRITION.THRESHOLDS;
    
    if (total >= thresholds.HIGH) {
      return 'high nutrition';
    } else if (total >= thresholds.BALANCED) {
      return 'balanced nutrition';
    } else if (total >= thresholds.MODERATE) {
      return 'moderate nutrition';
    } else {
      return 'low nutrition';
    }
  }
}