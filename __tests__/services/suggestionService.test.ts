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
});