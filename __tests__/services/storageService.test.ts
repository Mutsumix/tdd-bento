import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageService } from '@/services/storageService';
import { Ingredient } from '@/types';
import { PlacedIngredient } from '@/types';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('StorageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User Ingredients Management', () => {
    const mockUserIngredients: Ingredient[] = [
      {
        id: 'user-001',
        name: 'カスタム唐揚げ',
        category: 'main',
        color: 'brown',
        nutrition: { vitamin: 20, protein: 80, fiber: 10 },
        cookingTime: 15,
        cost: 200,
        season: 'all',
        isFrozen: false,
        isReadyToEat: false,
        defaultSize: { width: 40, height: 30 },
        icon: 'circle'
      }
    ];

    it('should save user ingredients to AsyncStorage', async () => {
      mockAsyncStorage.setItem.mockResolvedValue();

      await StorageService.saveUserIngredients(mockUserIngredients);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'user_ingredients',
        JSON.stringify(mockUserIngredients)
      );
    });

    it('should load user ingredients from AsyncStorage', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockUserIngredients));

      const result = await StorageService.loadUserIngredients();

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('user_ingredients');
      expect(result).toEqual(mockUserIngredients);
    });

    it('should return empty array when no user ingredients exist', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await StorageService.loadUserIngredients();

      expect(result).toEqual([]);
    });

    it('should handle corrupted user ingredients data gracefully', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('invalid json');

      const result = await StorageService.loadUserIngredients();

      expect(result).toEqual([]);
    });

    it('should add a new user ingredient', async () => {
      const existingIngredients = [mockUserIngredients[0]];
      const newIngredient: Ingredient = {
        id: 'user-002',
        name: 'カスタムサラダ',
        category: 'side',
        color: 'green',
        nutrition: { vitamin: 90, protein: 10, fiber: 60 },
        cookingTime: 5,
        cost: 100,
        season: 'all',
        isFrozen: false,
        isReadyToEat: true,
        defaultSize: { width: 35, height: 25 },
        icon: 'circle'
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingIngredients));
      mockAsyncStorage.setItem.mockResolvedValue();

      await StorageService.addUserIngredient(newIngredient);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'user_ingredients',
        JSON.stringify([...existingIngredients, newIngredient])
      );
    });

    it('should remove a user ingredient by id', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockUserIngredients));
      mockAsyncStorage.setItem.mockResolvedValue();

      await StorageService.removeUserIngredient('user-001');

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'user_ingredients',
        JSON.stringify([])
      );
    });
  });

  describe('Bento State Management', () => {
    const mockPlacedIngredients: PlacedIngredient[] = [
      {
        id: 'placed-001',
        ingredientId: 'ingredient-001',
        position: { x: 10, y: 10 },
        size: { width: 40, height: 30 },
        partitionId: 'partition-001'
      }
    ];

    it('should save bento state to AsyncStorage', async () => {
      mockAsyncStorage.setItem.mockResolvedValue();

      await StorageService.saveBentoState(mockPlacedIngredients);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'bento_state',
        JSON.stringify(mockPlacedIngredients)
      );
    });

    it('should load bento state from AsyncStorage', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockPlacedIngredients));

      const result = await StorageService.loadBentoState();

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('bento_state');
      expect(result).toEqual(mockPlacedIngredients);
    });

    it('should return empty array when no bento state exists', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await StorageService.loadBentoState();

      expect(result).toEqual([]);
    });

    it('should handle corrupted bento state data gracefully', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('invalid json');

      const result = await StorageService.loadBentoState();

      expect(result).toEqual([]);
    });

    it('should clear bento state', async () => {
      mockAsyncStorage.removeItem.mockResolvedValue();

      await StorageService.clearBentoState();

      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('bento_state');
    });
  });

  describe('Error Handling', () => {
    it('should handle AsyncStorage errors when saving user ingredients', async () => {
      const error = new Error('Storage error');
      mockAsyncStorage.setItem.mockRejectedValue(error);

      await expect(StorageService.saveUserIngredients([])).rejects.toThrow('Storage error');
    });

    it('should handle AsyncStorage errors when loading user ingredients', async () => {
      const error = new Error('Storage error');
      mockAsyncStorage.getItem.mockRejectedValue(error);

      await expect(StorageService.loadUserIngredients()).rejects.toThrow('Storage error');
    });

    it('should handle AsyncStorage errors when saving bento state', async () => {
      const error = new Error('Storage error');
      mockAsyncStorage.setItem.mockRejectedValue(error);

      await expect(StorageService.saveBentoState([])).rejects.toThrow('Storage error');
    });

    it('should handle AsyncStorage errors when loading bento state', async () => {
      const error = new Error('Storage error');
      mockAsyncStorage.getItem.mockRejectedValue(error);

      await expect(StorageService.loadBentoState()).rejects.toThrow('Storage error');
    });
  });

  describe('Storage Keys', () => {
    it('should use consistent storage keys across operations', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('[]');
      mockAsyncStorage.setItem.mockResolvedValue();

      // Test that keys are consistent
      await StorageService.loadUserIngredients();
      await StorageService.saveUserIngredients([]);
      
      const getUserIngredientsCalls = mockAsyncStorage.getItem.mock.calls.filter(
        call => call[0] === 'user_ingredients'
      );
      const setUserIngredientsCalls = mockAsyncStorage.setItem.mock.calls.filter(
        call => call[0] === 'user_ingredients'
      );

      expect(getUserIngredientsCalls).toHaveLength(1);
      expect(setUserIngredientsCalls).toHaveLength(1);
    });
  });
});