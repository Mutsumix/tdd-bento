import { Ingredient } from '@/types';
import { validateIngredient, createIngredient } from '@/utils/ingredient';

describe('Ingredient Model', () => {
  const validIngredientData = {
    id: 'test-1',
    name: '唐揚げ',
    category: 'main' as const,
    color: 'brown' as const,
    nutrition: {
      vitamin: 20,
      protein: 80,
      fiber: 10
    },
    cookingTime: 15,
    cost: 200,
    season: 'all' as const,
    isFrozen: false,
    isReadyToEat: false,
    defaultSize: { width: 50, height: 30 },
    icon: 'circle'
  };

  describe('Ingredient interface', () => {
    it('should have correct type structure', () => {
      const ingredient: Ingredient = validIngredientData;
      expect(ingredient.id).toBe('test-1');
      expect(ingredient.name).toBe('唐揚げ');
      expect(ingredient.category).toBe('main');
    });
  });

  describe('validateIngredient', () => {
    it('should validate correct ingredient', () => {
      const result = validateIngredient(validIngredientData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject ingredient with invalid nutrition values', () => {
      const invalidIngredient = {
        ...validIngredientData,
        nutrition: {
          vitamin: 150, // Invalid: over 100
          protein: -10, // Invalid: under 0
          fiber: 50
        }
      };
      
      const result = validateIngredient(invalidIngredient);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('nutrition.vitamin must be between 0 and 100');
      expect(result.errors).toContain('nutrition.protein must be between 0 and 100');
    });

    it('should reject ingredient with missing required fields', () => {
      const incompleteIngredient = {
        id: 'test-2',
        name: 'test'
        // Missing other required fields
      };
      
      const result = validateIngredient(incompleteIngredient as any);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('createIngredient', () => {
    it('should create a valid ingredient with default values', () => {
      const minimal = {
        name: 'テスト食材',
        category: 'other' as const,
        color: 'white' as const
      };
      
      const ingredient = createIngredient(minimal);
      expect(ingredient.id).toBeDefined();
      expect(ingredient.name).toBe('テスト食材');
      expect(ingredient.nutrition.vitamin).toBe(0);
      expect(ingredient.cookingTime).toBe(0);
      expect(ingredient.cost).toBe(0);
    });
  });
});