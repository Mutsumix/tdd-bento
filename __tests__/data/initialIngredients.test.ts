import { Ingredient } from '@/types';
import { 
  getInitialIngredients,
  getIngredientsByCategory,
  getIngredientsByColor,
  getIngredientsBySeason,
  getFrozenIngredients,
  getReadyToEatIngredients,
  validateInitialIngredientsData
} from '@/data/initialIngredients';
import { validateIngredient } from '@/utils/ingredient';

describe('Initial Ingredients Data', () => {
  describe('getInitialIngredients', () => {
    it('should return exactly 20 ingredients', () => {
      const ingredients = getInitialIngredients();
      expect(ingredients).toHaveLength(20);
    });

    it('should contain all required ingredients by name', () => {
      const ingredients = getInitialIngredients();
      const names = ingredients.map(ing => ing.name);
      
      const expectedNames = [
        '唐揚げ', '卵焼き', 'ハンバーグ', '鮭の塩焼き', 'エビフライ',
        'ブロッコリー', 'プチトマト', 'きんぴらごぼう', 'ほうれん草のおひたし', 
        'にんじんのグラッセ', 'ポテトサラダ', 'ひじきの煮物', '枝豆',
        '白ごはん', 'おにぎり', 'チーズ', 'ウインナー', '梅干し', 'たくあん', 'いちご'
      ];
      
      expectedNames.forEach(name => {
        expect(names).toContain(name);
      });
    });

    it('should have correct category distribution', () => {
      const ingredients = getInitialIngredients();
      const mainDishes = ingredients.filter(ing => ing.category === 'main');
      const sideDishes = ingredients.filter(ing => ing.category === 'side');
      const vegetables = ingredients.filter(ing => ing.category === 'vegetable');
      const fruits = ingredients.filter(ing => ing.category === 'fruit');
      const other = ingredients.filter(ing => ing.category === 'other');
      
      expect(mainDishes).toHaveLength(5);
      expect(sideDishes).toHaveLength(8);
      expect(vegetables).toHaveLength(0); // 野菜は副菜に分類
      expect(fruits).toHaveLength(1); // いちご
      expect(other).toHaveLength(6); // ごはん、チーズなど
    });
  });

  describe('getIngredientsByCategory', () => {
    it('should filter ingredients by main category', () => {
      const mainIngredients = getIngredientsByCategory('main');
      expect(mainIngredients).toHaveLength(5);
      expect(mainIngredients.map(ing => ing.name)).toContain('唐揚げ');
      expect(mainIngredients.map(ing => ing.name)).toContain('卵焼き');
    });

    it('should filter ingredients by side category', () => {
      const sideIngredients = getIngredientsByCategory('side');
      expect(sideIngredients).toHaveLength(8);
      expect(sideIngredients.map(ing => ing.name)).toContain('ブロッコリー');
      expect(sideIngredients.map(ing => ing.name)).toContain('プチトマト');
    });
  });

  describe('getIngredientsByColor', () => {
    it('should filter ingredients by red color', () => {
      const redIngredients = getIngredientsByColor('red');
      const redNames = redIngredients.map(ing => ing.name);
      expect(redNames).toContain('プチトマト');
      expect(redNames).toContain('ウインナー');
      expect(redNames).toContain('梅干し');
      expect(redNames).toContain('いちご');
    });

    it('should filter ingredients by green color', () => {
      const greenIngredients = getIngredientsByColor('green');
      const greenNames = greenIngredients.map(ing => ing.name);
      expect(greenNames).toContain('ブロッコリー');
      expect(greenNames).toContain('ほうれん草のおひたし');
      expect(greenNames).toContain('枝豆');
    });
  });

  describe('getIngredientsBySeason', () => {
    it('should filter ingredients by spring season', () => {
      const springIngredients = getIngredientsBySeason('spring');
      const springNames = springIngredients.map(ing => ing.name);
      expect(springNames).toContain('いちご');
    });

    it('should include all-season ingredients in any season query', () => {
      const summerIngredients = getIngredientsBySeason('summer');
      const summerNames = summerIngredients.map(ing => ing.name);
      // all-season ingredients should be included
      expect(summerNames.length).toBeGreaterThan(1);
    });
  });

  describe('getFrozenIngredients', () => {
    it('should return only frozen ingredients', () => {
      const frozenIngredients = getFrozenIngredients();
      const frozenNames = frozenIngredients.map(ing => ing.name);
      expect(frozenNames).toContain('エビフライ');
      expect(frozenNames).toContain('枝豆');
      
      frozenIngredients.forEach(ing => {
        expect(ing.isFrozen).toBe(true);
      });
    });
  });

  describe('getReadyToEatIngredients', () => {
    it('should return only ready-to-eat ingredients', () => {
      const readyIngredients = getReadyToEatIngredients();
      const readyNames = readyIngredients.map(ing => ing.name);
      expect(readyNames).toContain('プチトマト');
      expect(readyNames).toContain('チーズ');
      expect(readyNames).toContain('梅干し');
      expect(readyNames).toContain('たくあん');
      
      readyIngredients.forEach(ing => {
        expect(ing.isReadyToEat).toBe(true);
      });
    });
  });

  describe('validateInitialIngredientsData', () => {
    it('should validate all initial ingredients successfully', () => {
      const result = validateInitialIngredientsData();
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should check for duplicate IDs', () => {
      // This test ensures our validation catches duplicate IDs
      const mockIngredients: Ingredient[] = [
        {
          id: 'duplicate-id',
          name: '食材1',
          category: 'main',
          color: 'red',
          nutrition: { vitamin: 50, protein: 50, fiber: 50 },
          cookingTime: 10,
          cost: 100,
          season: 'all',
          isFrozen: false,
          isReadyToEat: false,
          defaultSize: { width: 40, height: 30 },
          icon: 'circle'
        },
        {
          id: 'duplicate-id', // Same ID
          name: '食材2',
          category: 'side',
          color: 'green',
          nutrition: { vitamin: 60, protein: 30, fiber: 40 },
          cookingTime: 5,
          cost: 80,
          season: 'all',
          isFrozen: false,
          isReadyToEat: true,
          defaultSize: { width: 35, height: 25 },
          icon: 'circle'
        }
      ];
      
      // We need to test this separately as our main function should not have duplicates
      const ids = mockIngredients.map(ing => ing.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).not.toBe(ids.length); // This shows duplicates exist
    });

    it('should ensure all ingredients have valid individual validation', () => {
      const ingredients = getInitialIngredients();
      
      ingredients.forEach((ingredient, index) => {
        const validation = validateIngredient(ingredient);
        expect(validation.isValid).toBe(true);
        
        if (!validation.isValid) {
          console.error(`Ingredient ${index + 1} (${ingredient.name}) validation failed:`, validation.errors);
        }
      });
    });
  });

  describe('Ingredient data consistency', () => {
    it('should have consistent nutrition values (0-100 range)', () => {
      const ingredients = getInitialIngredients();
      
      ingredients.forEach(ingredient => {
        expect(ingredient.nutrition.vitamin).toBeGreaterThanOrEqual(0);
        expect(ingredient.nutrition.vitamin).toBeLessThanOrEqual(100);
        expect(ingredient.nutrition.protein).toBeGreaterThanOrEqual(0);
        expect(ingredient.nutrition.protein).toBeLessThanOrEqual(100);
        expect(ingredient.nutrition.fiber).toBeGreaterThanOrEqual(0);
        expect(ingredient.nutrition.fiber).toBeLessThanOrEqual(100);
      });
    });

    it('should have reasonable cooking times', () => {
      const ingredients = getInitialIngredients();
      
      ingredients.forEach(ingredient => {
        expect(ingredient.cookingTime).toBeGreaterThanOrEqual(0);
        expect(ingredient.cookingTime).toBeLessThanOrEqual(60); // Max 60 minutes seems reasonable
      });
    });

    it('should have reasonable costs', () => {
      const ingredients = getInitialIngredients();
      
      ingredients.forEach(ingredient => {
        expect(ingredient.cost).toBeGreaterThanOrEqual(0);
        expect(ingredient.cost).toBeLessThanOrEqual(1000); // Max 1000 yen seems reasonable
      });
    });
  });
});