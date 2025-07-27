import { SuggestionService } from '@/services/suggestionService';
import { Ingredient } from '@/types';

describe('SuggestionService', () => {
  const mockIngredients: Ingredient[] = [
    {
      id: 'frozen-gyoza',
      name: '冷凍餃子',
      category: 'main',
      color: 'brown',
      cookingTime: 5,
      isFrozen: true,
      isReadyToEat: false,
      nutrition: { vitamin: 20, protein: 60, fiber: 10 },
      cost: 200,
      defaultSize: { width: 40, height: 30 },
      icon: 'circle'
    },
    {
      id: 'ready-salad',
      name: 'そのままサラダ',
      category: 'side',
      color: 'green',
      cookingTime: 0,
      isFrozen: false,
      isReadyToEat: true,
      nutrition: { vitamin: 80, protein: 10, fiber: 70 },
      cost: 150,
      defaultSize: { width: 50, height: 20 },
      icon: 'rectangle'
    },
    {
      id: 'fresh-chicken',
      name: '鶏肉',
      category: 'main',
      color: 'white',
      cookingTime: 15,
      isFrozen: false,
      isReadyToEat: false,
      nutrition: { vitamin: 30, protein: 90, fiber: 0 },
      cost: 300,
      defaultSize: { width: 60, height: 40 },
      icon: 'oval'
    },
    {
      id: 'frozen-ready-fruit',
      name: '冷凍フルーツミックス',
      category: 'side',
      color: 'red',
      cookingTime: 0,
      isFrozen: true,
      isReadyToEat: true,
      nutrition: { vitamin: 90, protein: 5, fiber: 30 },
      cost: 250,
      defaultSize: { width: 30, height: 30 },
      icon: 'circle'
    }
  ];

  describe('calculateSpeedScore', () => {
    it('should calculate score for frozen ingredient: 50 + 0 - cookingTime', () => {
      const score = SuggestionService.calculateSpeedScore(mockIngredients[0]);
      expect(score).toBe(45); // 50 (frozen) + 0 (not ready) - 5 (cooking time)
    });

    it('should calculate score for ready-to-eat ingredient: 0 + 50 - cookingTime', () => {
      const score = SuggestionService.calculateSpeedScore(mockIngredients[1]);
      expect(score).toBe(50); // 0 (not frozen) + 50 (ready) - 0 (cooking time)
    });

    it('should calculate score for regular ingredient: 0 + 0 - cookingTime', () => {
      const score = SuggestionService.calculateSpeedScore(mockIngredients[2]);
      expect(score).toBe(-15); // 0 (not frozen) + 0 (not ready) - 15 (cooking time)
    });

    it('should calculate highest score for frozen + ready-to-eat ingredient', () => {
      const score = SuggestionService.calculateSpeedScore(mockIngredients[3]);
      expect(score).toBe(100); // 50 (frozen) + 50 (ready) - 0 (cooking time)
    });
  });

  describe('getSuggestionsForSpeed', () => {
    it('should return ingredients sorted by speed score (highest first)', () => {
      const suggestions = SuggestionService.getSuggestionsForSpeed(mockIngredients);
      
      expect(suggestions).toHaveLength(4);
      expect(suggestions[0].id).toBe('frozen-ready-fruit'); // score: 100
      expect(suggestions[1].id).toBe('ready-salad'); // score: 50
      expect(suggestions[2].id).toBe('frozen-gyoza'); // score: 45
      expect(suggestions[3].id).toBe('fresh-chicken'); // score: -15
    });

    it('should limit results when count is specified', () => {
      const suggestions = SuggestionService.getSuggestionsForSpeed(mockIngredients, 2);
      
      expect(suggestions).toHaveLength(2);
      expect(suggestions[0].id).toBe('frozen-ready-fruit');
      expect(suggestions[1].id).toBe('ready-salad');
    });

    it('should return empty array for empty ingredients list', () => {
      const suggestions = SuggestionService.getSuggestionsForSpeed([]);
      expect(suggestions).toEqual([]);
    });
  });

  describe('getSuggestionsWithScores', () => {
    it('should return ingredients with their calculated speed scores', () => {
      const results = SuggestionService.getSuggestionsWithScores(mockIngredients, 'speed');
      
      expect(results).toHaveLength(4);
      expect(results[0]).toEqual({
        ingredient: mockIngredients[3],
        score: 100,
        reason: 'frozen + ready-to-eat'
      });
      expect(results[1]).toEqual({
        ingredient: mockIngredients[1],
        score: 50,
        reason: 'ready-to-eat'
      });
      expect(results[2]).toEqual({
        ingredient: mockIngredients[0],
        score: 45,
        reason: 'frozen'
      });
      expect(results[3]).toEqual({
        ingredient: mockIngredients[2],
        score: -15,
        reason: 'needs cooking'
      });
    });
  });

  describe('calculateNutritionScore', () => {
    it('should calculate nutrition score for balanced ingredient combination', () => {
      // Mock ingredient combination that totals: vitamin=100, protein=100, fiber=100
      const perfectIngredients = [
        mockIngredients[0], // vitamin: 20, protein: 60, fiber: 10
        mockIngredients[1]  // vitamin: 80, protein: 10, fiber: 70
        // Total: vitamin: 100, protein: 70, fiber: 80
      ];
      
      const score = SuggestionService.calculateNutritionScore(perfectIngredients);
      // vitaminScore = 100 - |100 - 100| = 100
      // proteinScore = 100 - |70 - 100| = 70  
      // fiberScore = 100 - |80 - 100| = 80
      // Expected: (100 + 70 + 80) / 3 = 83.33
      expect(score).toBeCloseTo(83.33, 2);
    });

    it('should calculate nutrition score for unbalanced combination', () => {
      const unbalancedIngredients = [
        mockIngredients[2], // vitamin: 30, protein: 90, fiber: 0
        mockIngredients[3]  // vitamin: 90, protein: 5, fiber: 30
        // Total: vitamin: 120, protein: 95, fiber: 30
      ];
      
      const score = SuggestionService.calculateNutritionScore(unbalancedIngredients);
      // vitaminScore = 100 - |120 - 100| = 80
      // proteinScore = 100 - |95 - 100| = 95
      // fiberScore = 100 - |30 - 100| = 30
      // Expected: (80 + 95 + 30) / 3 = 68.33
      expect(score).toBeCloseTo(68.33, 2);
    });

    it('should return 0 for empty ingredients array', () => {
      const score = SuggestionService.calculateNutritionScore([]);
      expect(score).toBe(0);
    });
  });

  describe('getSuggestionsForNutrition', () => {
    it('should return ingredients sorted by nutrition balance score (highest first)', () => {
      const suggestions = SuggestionService.getSuggestionsForNutrition(mockIngredients);
      
      expect(suggestions).toHaveLength(4);
      // Note: This test will initially fail since the method doesn't exist
      // The actual order will be determined by individual nutrition balance
    });

    it('should limit results when count is specified', () => {
      const suggestions = SuggestionService.getSuggestionsForNutrition(mockIngredients, 2);
      
      expect(suggestions).toHaveLength(2);
    });

    it('should return empty array for empty ingredients list', () => {
      const suggestions = SuggestionService.getSuggestionsForNutrition([]);
      expect(suggestions).toEqual([]);
    });
  });

  describe('getSuggestionsWithScores - nutrition type', () => {
    it('should return ingredients with their calculated nutrition scores', () => {
      const results = SuggestionService.getSuggestionsWithScores(mockIngredients, 'nutrition');
      
      expect(results).toHaveLength(4);
      expect(results[0]).toHaveProperty('ingredient');
      expect(results[0]).toHaveProperty('score');
      expect(results[0]).toHaveProperty('reason');
      expect(typeof results[0].score).toBe('number');
      expect(typeof results[0].reason).toBe('string');
    });

    it('should throw error for unsupported suggestion type', () => {
      expect(() => {
        SuggestionService.getSuggestionsWithScores(mockIngredients, 'invalid' as any);
      }).toThrow('Unsupported suggestion type: invalid');
    });
  });

  describe('calculateColorScore', () => {
    it('should calculate color score for diverse color combination', () => {
      // Mock ingredients with different colors: brown, green, white, red
      const diverseIngredients = [
        mockIngredients[0], // brown
        mockIngredients[1], // green  
        mockIngredients[2], // white
        mockIngredients[3]  // red
      ];
      
      const score = SuggestionService.calculateColorScore(diverseIngredients);
      // uniqueColors = 4, duplicates = 0
      // Expected: 4 * 20 - 0 * 10 = 80
      expect(score).toBe(80);
    });

    it('should calculate color score with duplicate colors penalty', () => {
      const duplicateIngredients = [
        mockIngredients[0], // brown
        mockIngredients[0], // brown (duplicate)
        mockIngredients[1], // green
        mockIngredients[1]  // green (duplicate)
      ];
      
      const score = SuggestionService.calculateColorScore(duplicateIngredients);
      // uniqueColors = 2, duplicates = 2 
      // Expected: 2 * 20 - 2 * 10 = 20
      expect(score).toBe(20);
    });

    it('should return 0 for empty ingredients array', () => {
      const score = SuggestionService.calculateColorScore([]);
      expect(score).toBe(0);
    });

    it('should handle single ingredient', () => {
      const singleIngredient = [mockIngredients[0]]; // brown
      
      const score = SuggestionService.calculateColorScore(singleIngredient);
      // uniqueColors = 1, duplicates = 0
      // Expected: 1 * 20 - 0 * 10 = 20
      expect(score).toBe(20);
    });
  });

  describe('getSuggestionsForColor', () => {
    it('should return ingredients sorted by color diversity score (highest first)', () => {
      const suggestions = SuggestionService.getSuggestionsForColor(mockIngredients);
      
      expect(suggestions).toHaveLength(4);
      // Note: This test will initially fail since the method doesn't exist
      // Individual ingredients get scored based on how they would contribute to color diversity
    });

    it('should limit results when count is specified', () => {
      const suggestions = SuggestionService.getSuggestionsForColor(mockIngredients, 2);
      
      expect(suggestions).toHaveLength(2);
    });

    it('should return empty array for empty ingredients list', () => {
      const suggestions = SuggestionService.getSuggestionsForColor([]);
      expect(suggestions).toEqual([]);
    });
  });

  describe('getSuggestionsWithScores - color type', () => {
    it('should return ingredients with their calculated color scores', () => {
      const results = SuggestionService.getSuggestionsWithScores(mockIngredients, 'color');
      
      expect(results).toHaveLength(4);
      expect(results[0]).toHaveProperty('ingredient');
      expect(results[0]).toHaveProperty('score');
      expect(results[0]).toHaveProperty('reason');
      expect(typeof results[0].score).toBe('number');
      expect(typeof results[0].reason).toBe('string');
    });
  });

  describe('calculateSeasonScore', () => {
    // Mock ingredients with different seasons
    const springIngredient: Ingredient = {
      ...mockIngredients[0],
      season: 'spring'
    };
    
    const summerIngredient: Ingredient = {
      ...mockIngredients[1], 
      season: 'summer'
    };
    
    const allSeasonIngredient: Ingredient = {
      ...mockIngredients[2],
      season: 'all'
    };
    
    const noSeasonIngredient: Ingredient = {
      ...mockIngredients[3]
      // No season property means it should be treated as undefined
    };

    it('should give 50 points for matching current season', () => {
      // Test with spring as current season
      const score = SuggestionService.calculateSeasonScore(springIngredient, 'spring');
      expect(score).toBe(50);
    });

    it('should give 0 points for non-matching season', () => {
      // Test summer ingredient in spring
      const score = SuggestionService.calculateSeasonScore(summerIngredient, 'spring');
      expect(score).toBe(0);
    });

    it('should give 25 points for all-season ingredients', () => {
      const score = SuggestionService.calculateSeasonScore(allSeasonIngredient, 'spring');
      expect(score).toBe(25);
    });

    it('should give 0 points for ingredients without season', () => {
      const score = SuggestionService.calculateSeasonScore(noSeasonIngredient, 'spring');
      expect(score).toBe(0);
    });

    it('should use actual current season when not specified', () => {
      // This will use the system's current season
      const score = SuggestionService.calculateSeasonScore(springIngredient);
      expect(typeof score).toBe('number');
      expect(score).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getSuggestionsForSeason', () => {
    const seasonalIngredients: Ingredient[] = [
      { ...mockIngredients[0], season: 'spring' },
      { ...mockIngredients[1], season: 'summer' },
      { ...mockIngredients[2], season: 'all' },
      { ...mockIngredients[3] } // no season
    ];

    it('should return ingredients sorted by season score (highest first)', () => {
      const suggestions = SuggestionService.getSuggestionsForSeason(seasonalIngredients, 'spring');
      
      expect(suggestions).toHaveLength(4);
      // Spring ingredient should be first (50 points)
      expect(suggestions[0].season).toBe('spring');
      // All-season should be second (25 points)
      expect(suggestions[1].season).toBe('all');
    });

    it('should limit results when count is specified', () => {
      const suggestions = SuggestionService.getSuggestionsForSeason(seasonalIngredients, 'spring', 2);
      
      expect(suggestions).toHaveLength(2);
    });

    it('should return empty array for empty ingredients list', () => {
      const suggestions = SuggestionService.getSuggestionsForSeason([], 'spring');
      expect(suggestions).toEqual([]);
    });
  });

  describe('getSuggestionsWithScores - season type', () => {
    it('should return ingredients with their calculated season scores', () => {
      const seasonalIngredients: Ingredient[] = [
        { ...mockIngredients[0], season: 'spring' },
        { ...mockIngredients[1], season: 'summer' },
        { ...mockIngredients[2], season: 'all' }
      ];
      
      const results = SuggestionService.getSuggestionsWithScores(seasonalIngredients, 'season', 'spring');
      
      expect(results).toHaveLength(3);
      expect(results[0]).toHaveProperty('ingredient');
      expect(results[0]).toHaveProperty('score');
      expect(results[0]).toHaveProperty('reason');
      expect(typeof results[0].score).toBe('number');
      expect(typeof results[0].reason).toBe('string');
    });
  });

  describe('getCurrentSeason', () => {
    it('should return a valid season', () => {
      const season = SuggestionService.getCurrentSeason();
      expect(['spring', 'summer', 'autumn', 'winter']).toContain(season);
    });

    it('should return correct season for given month', () => {
      // Test specific months
      expect(SuggestionService.getCurrentSeason(new Date('2024-03-15'))).toBe('spring'); // March
      expect(SuggestionService.getCurrentSeason(new Date('2024-06-15'))).toBe('summer'); // June  
      expect(SuggestionService.getCurrentSeason(new Date('2024-09-15'))).toBe('autumn'); // September
      expect(SuggestionService.getCurrentSeason(new Date('2024-12-15'))).toBe('winter'); // December
    });
  });

  describe('calculateCostScore', () => {
    it('should calculate cost score for low-cost ingredient', () => {
      // Mock ingredient with cost: 200
      const lowCostIngredient: Ingredient = {
        ...mockIngredients[0],
        cost: 200
      };
      
      const score = SuggestionService.calculateCostScore(lowCostIngredient);
      // Expected: 1000 - 200 = 800
      expect(score).toBe(800);
    });

    it('should calculate cost score for high-cost ingredient', () => {
      // Mock ingredient with cost: 800  
      const highCostIngredient: Ingredient = {
        ...mockIngredients[1],
        cost: 800
      };
      
      const score = SuggestionService.calculateCostScore(highCostIngredient);
      // Expected: 1000 - 800 = 200
      expect(score).toBe(200);
    });

    it('should handle zero cost ingredient', () => {
      const freeCostIngredient: Ingredient = {
        ...mockIngredients[2],
        cost: 0
      };
      
      const score = SuggestionService.calculateCostScore(freeCostIngredient);
      // Expected: 1000 - 0 = 1000
      expect(score).toBe(1000);
    });

    it('should handle cost higher than base value', () => {
      const expensiveIngredient: Ingredient = {
        ...mockIngredients[3],
        cost: 1200
      };
      
      const score = SuggestionService.calculateCostScore(expensiveIngredient);
      // Expected: 1000 - 1200 = -200 (negative score allowed)
      expect(score).toBe(-200);
    });
  });

  describe('getSuggestionsForCost', () => {
    const costTestIngredients: Ingredient[] = [
      { ...mockIngredients[0], cost: 300 }, // score: 700
      { ...mockIngredients[1], cost: 100 }, // score: 900
      { ...mockIngredients[2], cost: 500 }, // score: 500
      { ...mockIngredients[3], cost: 50 }   // score: 950
    ];

    it('should return ingredients sorted by cost score (highest first)', () => {
      const suggestions = SuggestionService.getSuggestionsForCost(costTestIngredients);
      
      expect(suggestions).toHaveLength(4);
      // Order: cost 50 (950pts), cost 100 (900pts), cost 300 (700pts), cost 500 (500pts)
      expect(suggestions[0].cost).toBe(50);   // Highest score (950)
      expect(suggestions[1].cost).toBe(100);  // Second highest (900)
      expect(suggestions[2].cost).toBe(300);  // Third (700)
      expect(suggestions[3].cost).toBe(500);  // Lowest score (500)
    });

    it('should limit results when count is specified', () => {
      const suggestions = SuggestionService.getSuggestionsForCost(costTestIngredients, 2);
      
      expect(suggestions).toHaveLength(2);
      expect(suggestions[0].cost).toBe(50);   // Highest score
      expect(suggestions[1].cost).toBe(100);  // Second highest
    });

    it('should return empty array for empty ingredients list', () => {
      const suggestions = SuggestionService.getSuggestionsForCost([]);
      expect(suggestions).toEqual([]);
    });
  });

  describe('getSuggestionsWithScores - cost type', () => {
    it('should return ingredients with their calculated cost scores', () => {
      const costTestIngredients: Ingredient[] = [
        { ...mockIngredients[0], cost: 200 }, // score: 800
        { ...mockIngredients[1], cost: 400 }, // score: 600
        { ...mockIngredients[2], cost: 100 }  // score: 900
      ];
      
      const results = SuggestionService.getSuggestionsWithScores(costTestIngredients, 'cost');
      
      expect(results).toHaveLength(3);
      expect(results[0]).toHaveProperty('ingredient');
      expect(results[0]).toHaveProperty('score');
      expect(results[0]).toHaveProperty('reason');
      expect(typeof results[0].score).toBe('number');
      expect(typeof results[0].reason).toBe('string');
      
      // Should be sorted by score (highest first)
      expect(results[0].score).toBe(900); // cost: 100
      expect(results[1].score).toBe(800); // cost: 200
      expect(results[2].score).toBe(600); // cost: 400
    });
  });
});