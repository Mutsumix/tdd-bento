import { Ingredient } from '@/types';

export interface SuggestionResult {
  ingredient: Ingredient;
  score: number;
  reason: string;
}

export class SuggestionService {
  /**
   * Calculate speed-focused score for an ingredient
   * Formula: score = (isFrozen ? 50 : 0) + (isReadyToEat ? 50 : 0) - cookingTime
   */
  static calculateSpeedScore(ingredient: Ingredient): number {
    const frozenBonus = ingredient.isFrozen ? 50 : 0;
    const readyBonus = ingredient.isReadyToEat ? 50 : 0;
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
   * Get ingredient suggestions with their scores and reasons
   */
  static getSuggestionsWithScores(ingredients: Ingredient[], type: 'speed'): SuggestionResult[] {
    if (type !== 'speed') {
      throw new Error(`Unsupported suggestion type: ${type}`);
    }

    const results = ingredients.map(ingredient => {
      const score = this.calculateSpeedScore(ingredient);
      const reason = this.getSpeedReason(ingredient);
      
      return {
        ingredient,
        score,
        reason
      };
    });

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
}