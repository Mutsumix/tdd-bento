import { IngredientService } from '@/services/ingredientService';
import { StorageService } from '@/services/StorageService';
import { Ingredient } from '@/types';
import { getInitialIngredients } from '@/data/initialIngredients';

// Mock dependencies
jest.mock('@/services/StorageService');
jest.mock('@/data/initialIngredients');

describe('IngredientService - User Ingredient Management', () => {
  const mockInitialIngredients: Ingredient[] = [
    {
      id: 'karaage',
      name: '唐揚げ',
      category: 'main',
      color: 'brown',
      nutrition: { vitamin: 15, protein: 85, fiber: 10 },
      cookingTime: 15,
      cost: 200,
      season: 'all',
      isFrozen: false,
      isReadyToEat: false,
      defaultSize: { width: 40, height: 40 },
      icon: 'chicken',
    },
  ];

  const mockUserIngredientData = {
    name: 'テスト食材',
    category: 'side' as const,
    color: 'green' as const,
    nutrition: { vitamin: 60, protein: 30, fiber: 40 },
    cookingTime: 10,
    cost: 150,
    season: 'all' as const,
    isFrozen: false,
    isReadyToEat: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getInitialIngredients as jest.Mock).mockReturnValue(mockInitialIngredients);
  });

  describe('createUserIngredient', () => {
    it('should create a new ingredient with generated ID and default values', () => {
      const result = IngredientService.createUserIngredient(mockUserIngredientData);
      
      expect(result).toMatchObject({
        ...mockUserIngredientData,
        id: expect.stringMatching(/^user-ingredient-\d+-[a-z0-9]{9}$/),
        defaultSize: { width: 40, height: 30 },
        icon: 'circle',
      });
    });

    it('should generate unique IDs for multiple ingredients', () => {
      const ingredient1 = IngredientService.createUserIngredient(mockUserIngredientData);
      const ingredient2 = IngredientService.createUserIngredient(mockUserIngredientData);
      
      expect(ingredient1.id).not.toBe(ingredient2.id);
    });
  });

  describe('addUserIngredient', () => {
    it('should add a new user ingredient and save to storage', async () => {
      const newIngredient = await IngredientService.addUserIngredient(mockUserIngredientData);
      
      expect(StorageService.addUserIngredient).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockUserIngredientData,
          id: expect.any(String),
          defaultSize: expect.any(Object),
          icon: expect.any(String),
        })
      );
      
      expect(newIngredient).toMatchObject({
        ...mockUserIngredientData,
        id: expect.any(String),
      });
    });

    it('should update internal cache after adding ingredient', async () => {
      const newIngredient = await IngredientService.addUserIngredient(mockUserIngredientData);
      const allIngredients = await IngredientService.getAllWithUserIngredients();
      
      expect(allIngredients).toContainEqual(newIngredient);
    });
  });

  describe('getAllWithUserIngredients', () => {
    it('should return combined initial and user ingredients', async () => {
      const mockUserIngredients: Ingredient[] = [{
        id: 'user-ingredient-123',
        name: 'ユーザー食材',
        category: 'side',
        color: 'yellow',
        nutrition: { vitamin: 50, protein: 50, fiber: 50 },
        cookingTime: 5,
        cost: 100,
        season: 'all',
        isFrozen: false,
        isReadyToEat: true,
        defaultSize: { width: 40, height: 30 },
        icon: 'circle',
      }];
      
      (StorageService.loadUserIngredients as jest.Mock).mockResolvedValue(mockUserIngredients);
      
      const allIngredients = await IngredientService.getAllWithUserIngredients();
      
      expect(allIngredients).toHaveLength(2);
      expect(allIngredients).toContainEqual(mockInitialIngredients[0]);
      expect(allIngredients).toContainEqual(mockUserIngredients[0]);
    });

    it('should handle empty user ingredients', async () => {
      (StorageService.loadUserIngredients as jest.Mock).mockResolvedValue([]);
      
      const allIngredients = await IngredientService.getAllWithUserIngredients();
      
      expect(allIngredients).toEqual(mockInitialIngredients);
    });
  });

  describe('loadUserIngredients', () => {
    it('should load user ingredients from storage and update cache', async () => {
      const mockUserIngredients: Ingredient[] = [{
        id: 'user-ingredient-456',
        name: '保存済み食材',
        category: 'main',
        color: 'red',
        nutrition: { vitamin: 70, protein: 60, fiber: 20 },
        cookingTime: 15,
        cost: 250,
        season: 'spring',
        isFrozen: true,
        isReadyToEat: false,
        defaultSize: { width: 45, height: 35 },
        icon: 'square',
      }];
      
      (StorageService.loadUserIngredients as jest.Mock).mockResolvedValue(mockUserIngredients);
      
      await IngredientService.loadUserIngredients();
      
      expect(StorageService.loadUserIngredients).toHaveBeenCalled();
      
      // Verify cache is updated by getting all ingredients
      const allIngredients = await IngredientService.getAllWithUserIngredients();
      expect(allIngredients).toContainEqual(mockUserIngredients[0]);
    });
  });

  describe('findById with user ingredients', () => {
    it('should find ingredients from both initial and user ingredients', async () => {
      const mockUserIngredient: Ingredient = {
        id: 'user-ingredient-789',
        name: 'ユーザー追加食材',
        category: 'vegetable',
        color: 'green',
        nutrition: { vitamin: 80, protein: 20, fiber: 60 },
        cookingTime: 5,
        cost: 80,
        season: 'summer',
        isFrozen: false,
        isReadyToEat: true,
        defaultSize: { width: 35, height: 35 },
        icon: 'leaf',
      };
      
      (StorageService.loadUserIngredients as jest.Mock).mockResolvedValue([mockUserIngredient]);
      await IngredientService.loadUserIngredients();
      
      // Should find initial ingredient
      const initialIngredient = await IngredientService.findByIdAsync('karaage');
      expect(initialIngredient).toEqual(mockInitialIngredients[0]);
      
      // Should find user ingredient
      const userIngredient = await IngredientService.findByIdAsync('user-ingredient-789');
      expect(userIngredient).toEqual(mockUserIngredient);
      
      // Should return null for non-existent ingredient
      const notFound = await IngredientService.findByIdAsync('non-existent');
      expect(notFound).toBeNull();
    });
  });
});