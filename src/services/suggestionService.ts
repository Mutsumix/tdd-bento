import { Ingredient } from '@/types';
import { getColorNameJP } from '@/utils/colors';

// Suggestion algorithm types
export type SuggestionType = 'speed' | 'nutrition' | 'color' | 'season' | 'cost';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

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
  },
  COLOR: {
    VARIETY_BONUS: 20,         // Bonus points per unique color
    DUPLICATE_PENALTY: 10      // Penalty points per duplicate color
  },
  SEASON: {
    MATCHING_BONUS: 50,        // Bonus points for matching current season
    ALL_SEASON_BONUS: 25       // Bonus points for all-season ingredients
  },
  COST: {
    BASE_VALUE: 1000           // Base value for cost calculation (1000 - cost = score)
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
   * Calculate color diversity score for ingredient combination
   * Formula: colorVariety = uniqueColors.length * 20
   *          colorPenalty = duplicateColors.length * 10
   *          score = colorVariety - colorPenalty
   */
  static calculateColorScore(ingredients: Ingredient[]): number {
    if (ingredients.length === 0) {
      return 0;
    }

    // Extract colors from all ingredients
    const colors = ingredients.map(ingredient => ingredient.color);
    
    // Calculate unique colors
    const uniqueColors = new Set(colors);
    const uniqueCount = uniqueColors.size;
    
    // Calculate duplicates (total colors - unique colors)
    const duplicateCount = colors.length - uniqueCount;
    
    // Calculate score using configuration constants
    const colorVariety = uniqueCount * SUGGESTION_CONFIG.COLOR.VARIETY_BONUS;
    const colorPenalty = duplicateCount * SUGGESTION_CONFIG.COLOR.DUPLICATE_PENALTY;
    
    return colorVariety - colorPenalty;
  }

  /**
   * Get ingredient suggestions sorted by color diversity score (highest first)
   */
  static getSuggestionsForColor(ingredients: Ingredient[], count?: number): Ingredient[] {
    if (ingredients.length === 0) {
      return [];
    }

    // For individual ingredients, calculate their contribution to color diversity
    const sorted = [...ingredients].sort((a, b) => {
      const scoreA = this.calculateColorScore([a]);
      const scoreB = this.calculateColorScore([b]);
      return scoreB - scoreA; // Descending order (highest score first)
    });

    return count ? sorted.slice(0, count) : sorted;
  }

  /**
   * Get ingredient suggestions with their scores and reasons
   */
  static getSuggestionsWithScores(ingredients: Ingredient[], type: SuggestionType, currentSeason?: Season): SuggestionResult[] {
    const scoreCalculators = {
      speed: (ingredient: Ingredient) => this.calculateSpeedScore(ingredient),
      nutrition: (ingredient: Ingredient) => this.calculateNutritionScore([ingredient]),
      color: (ingredient: Ingredient) => this.calculateColorScore([ingredient]),
      season: (ingredient: Ingredient) => this.calculateSeasonScore(ingredient, currentSeason),
      cost: (ingredient: Ingredient) => this.calculateCostScore(ingredient)
    };

    const reasonGenerators = {
      speed: (ingredient: Ingredient) => this.getSpeedReason(ingredient),
      nutrition: (ingredient: Ingredient) => this.getNutritionReason(ingredient),
      color: (ingredient: Ingredient) => this.getColorReason(ingredient),
      season: (ingredient: Ingredient) => this.getSeasonReason(ingredient),
      cost: (ingredient: Ingredient) => this.getCostReason(ingredient)
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

  /**
   * Generate reason text for color diversity score
   */
  private static getColorReason(ingredient: Ingredient): string {
    const colorName = getColorNameJP(ingredient.color);
    return `${colorName}色で彩り豊か`;
  }

  /**
   * Get the current season based on date (Japan seasons)
   */
  static getCurrentSeason(date?: Date): Season {
    const currentDate = date || new Date();
    const month = currentDate.getMonth() + 1; // getMonth() returns 0-11
    
    if (month >= 3 && month <= 5) {
      return 'spring';
    } else if (month >= 6 && month <= 8) {
      return 'summer';
    } else if (month >= 9 && month <= 11) {
      return 'autumn';
    } else {
      return 'winter';
    }
  }

  /**
   * Calculate season-focused score for an ingredient
   * Formula: score = (ingredient.season === currentSeason ? 50 : 0) + (ingredient.season === 'all' ? 25 : 0)
   */
  static calculateSeasonScore(ingredient: Ingredient, currentSeason?: Season): number {
    const season = currentSeason || this.getCurrentSeason();
    
    if (ingredient.season === season) {
      return SUGGESTION_CONFIG.SEASON.MATCHING_BONUS;
    } else if (ingredient.season === 'all') {
      return SUGGESTION_CONFIG.SEASON.ALL_SEASON_BONUS;
    } else {
      return 0;
    }
  }

  /**
   * Get ingredient suggestions sorted by season score (highest first)
   */
  static getSuggestionsForSeason(ingredients: Ingredient[], currentSeason?: Season, count?: number): Ingredient[] {
    if (ingredients.length === 0) {
      return [];
    }

    const sorted = [...ingredients].sort((a, b) => {
      const scoreA = this.calculateSeasonScore(a, currentSeason);
      const scoreB = this.calculateSeasonScore(b, currentSeason);
      return scoreB - scoreA; // Descending order (highest score first)
    });

    return count ? sorted.slice(0, count) : sorted;
  }

  /**
   * Generate reason text for season score
   */
  private static getSeasonReason(ingredient: Ingredient): string {
    const currentSeason = this.getCurrentSeason();
    
    if (ingredient.season === currentSeason) {
      return `今の季節（${this.getSeasonNameJP(currentSeason)}）に最適`;
    } else if (ingredient.season === 'all') {
      return '通年利用可能';
    } else if (ingredient.season) {
      return `${this.getSeasonNameJP(ingredient.season)}の食材`;
    } else {
      return '季節指定なし';
    }
  }

  /**
   * Get Japanese season name
   */
  private static getSeasonNameJP(season: Season): string {
    const seasonNames = {
      spring: '春',
      summer: '夏', 
      autumn: '秋',
      winter: '冬'
    };
    return seasonNames[season];
  }

  /**
   * Calculate cost-focused score for an ingredient
   * Formula: score = BASE_VALUE - ingredient.cost (lower cost = higher score)
   */
  static calculateCostScore(ingredient: Ingredient): number {
    return SUGGESTION_CONFIG.COST.BASE_VALUE - ingredient.cost;
  }

  /**
   * Get ingredient suggestions sorted by cost score (highest first)
   */
  static getSuggestionsForCost(ingredients: Ingredient[], count?: number): Ingredient[] {
    if (ingredients.length === 0) {
      return [];
    }

    const sorted = [...ingredients].sort((a, b) => {
      const scoreA = this.calculateCostScore(a);
      const scoreB = this.calculateCostScore(b);
      return scoreB - scoreA; // Descending order (highest score first)
    });

    return count ? sorted.slice(0, count) : sorted;
  }

  /**
   * Generate reason text for cost score
   */
  private static getCostReason(ingredient: Ingredient): string {
    const cost = ingredient.cost;
    
    if (cost <= 50) {
      return 'とても安価でお得';
    } else if (cost <= 100) {
      return '安価でコスパ良好';
    } else if (cost <= 200) {
      return '標準的な価格';
    } else if (cost <= 400) {
      return 'やや高価';
    } else {
      return '高価な食材';
    }
  }
}