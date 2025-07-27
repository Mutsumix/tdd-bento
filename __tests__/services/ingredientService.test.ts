import { IngredientService } from '@/services/ingredientService';
import { StorageService } from '@/services/StorageService';
import { Ingredient } from '@/types';
import { getInitialIngredients } from '@/data/initialIngredients';

// Mock dependencies
jest.mock('@/services/StorageService');
jest.mock('@/data/initialIngredients', () => ({
  getInitialIngredients: jest.fn()
}));

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

// Set up mock before module import
(getInitialIngredients as jest.Mock).mockReturnValue(mockInitialIngredients);

describe('IngredientService - User Ingredient Management', () => {
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

  const mockUserIngredients: Ingredient[] = [
    {
      id: 'user-ingredient-123-abc',
      name: 'ユーザー食材1',
      category: 'side',
      color: 'green',
      nutrition: { vitamin: 50, protein: 20, fiber: 30 },
      cookingTime: 5,
      cost: 100,
      season: 'all',
      isFrozen: false,
      isReadyToEat: false,
      defaultSize: { width: 40, height: 30 },
      icon: 'circle',
    },
    {
      id: 'user-ingredient-456-def',
      name: 'ユーザー食材2',
      category: 'main',
      color: 'red',
      nutrition: { vitamin: 30, protein: 60, fiber: 20 },
      cookingTime: 10,
      cost: 200,
      season: 'spring',
      isFrozen: true,
      isReadyToEat: false,
      defaultSize: { width: 40, height: 30 },
      icon: 'circle',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (getInitialIngredients as jest.Mock).mockReturnValue(mockInitialIngredients);
    // Initialize service with mock data for testing
    IngredientService.initializeForTesting(mockInitialIngredients);
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
      const result1 = IngredientService.createUserIngredient(mockUserIngredientData);
      const result2 = IngredientService.createUserIngredient(mockUserIngredientData);
      
      expect(result1.id).not.toBe(result2.id);
    });
  });

  describe('addUserIngredient', () => {
    it('should add a new user ingredient and save to storage', async () => {
      const result = await IngredientService.addUserIngredient(mockUserIngredientData);
      
      expect(result).toMatchObject({
        ...mockUserIngredientData,
        id: expect.stringMatching(/^user-ingredient-\d+-[a-z0-9]{9}$/),
        defaultSize: { width: 40, height: 30 },
        icon: 'circle',
      });
      
      expect(StorageService.addUserIngredient).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockUserIngredientData,
          id: expect.stringMatching(/^user-ingredient-\d+-[a-z0-9]{9}$/),
        })
      );
    });

    it('should update internal cache after adding ingredient', async () => {
      await IngredientService.addUserIngredient(mockUserIngredientData);
      
      const allIngredients = await IngredientService.getAllWithUserIngredients();
      expect(allIngredients).toHaveLength(mockInitialIngredients.length + 1);
      expect(allIngredients).toEqual(
        expect.arrayContaining([
          ...mockInitialIngredients,
          expect.objectContaining(mockUserIngredientData),
        ])
      );
    });
  });

  describe('getAllWithUserIngredients', () => {
    it('should return combined initial and user ingredients', async () => {
      (StorageService.loadUserIngredients as jest.Mock).mockResolvedValue(mockUserIngredients);
      await IngredientService.loadUserIngredients();
      
      const result = await IngredientService.getAllWithUserIngredients();
      
      expect(result).toEqual([...mockInitialIngredients, ...mockUserIngredients]);
    });

    it('should handle empty user ingredients', async () => {
      (StorageService.loadUserIngredients as jest.Mock).mockResolvedValue([]);
      await IngredientService.loadUserIngredients();
      
      const result = await IngredientService.getAllWithUserIngredients();
      
      expect(result).toEqual(mockInitialIngredients);
    });
  });

  describe('loadUserIngredients', () => {
    it('should load user ingredients from storage and update cache', async () => {
      (StorageService.loadUserIngredients as jest.Mock).mockResolvedValue(mockUserIngredients);
      
      await IngredientService.loadUserIngredients();
      
      expect(StorageService.loadUserIngredients).toHaveBeenCalled();
      
      const allIngredients = await IngredientService.getAllWithUserIngredients();
      expect(allIngredients).toEqual([...mockInitialIngredients, ...mockUserIngredients]);
    });
  });

  describe('findById with user ingredients', () => {
    it('should find ingredients from both initial and user ingredients', async () => {
      const mockUserIngredient = mockUserIngredients[0];
      (StorageService.loadUserIngredients as jest.Mock).mockResolvedValue([mockUserIngredient]);
      await IngredientService.loadUserIngredients();
      
      // Test finding initial ingredient
      const initialResult = await IngredientService.findByIdAsync('karaage');
      expect(initialResult).toEqual(mockInitialIngredients[0]);
      
      // Test finding user ingredient
      const userResult = await IngredientService.findByIdAsync(mockUserIngredient.id);
      expect(userResult).toEqual(mockUserIngredient);
      
      // Test not found
      const notFoundResult = await IngredientService.findByIdAsync('non-existent');
      expect(notFoundResult).toBeNull();
    });
  });
});