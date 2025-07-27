import { PlacedIngredientService } from '@/services/placedIngredientService';
import { StorageService } from '@/services/StorageService';
import { 
  Ingredient, 
  BentoBox, 
  PlacedIngredient, 
  CreatePlacedIngredientInput 
} from '@/types';

// Mock StorageService
jest.mock('@/services/StorageService');
const mockStorageService = jest.mocked(StorageService);

describe('PlacedIngredientService', () => {
  const mockIngredient: Ingredient = {
    id: 'ingredient-1',
    name: '唐揚げ',
    category: 'main',
    color: 'brown',
    nutrition: { vitamin: 20, protein: 80, fiber: 10 },
    cookingTime: 15,
    cost: 250,
    season: 'all',
    isFrozen: false,
    isReadyToEat: false,
    defaultSize: { width: 40, height: 30 },
    icon: 'circle'
  };

  const mockBentoBox: BentoBox = {
    id: 'bento-1',
    type: 'rectangle',
    dimensions: { width: 300, height: 200 },
    partitions: [
      {
        id: 'partition-1',
        type: 'rice',
        bounds: { x: 0, y: 0, width: 150, height: 200 }
      },
      {
        id: 'partition-2',
        type: 'side',
        bounds: { x: 150, y: 0, width: 150, height: 200 }
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PlacedIngredient Creation', () => {
    test('should generate unique ID for placed ingredient', () => {
      const input: CreatePlacedIngredientInput = {
        ingredientId: mockIngredient.id,
        partitionId: 'partition-1',
        position: { x: 10, y: 10 },
        size: mockIngredient.defaultSize
      };

      const placedIngredient = PlacedIngredientService.createPlacedIngredient(input);

      expect(placedIngredient.id).toMatch(/^placed-\d+-[a-z0-9]+$/);
      expect(placedIngredient.ingredientId).toBe(mockIngredient.id);
      expect(placedIngredient.partitionId).toBe('partition-1');
      expect(placedIngredient.position).toEqual({ x: 10, y: 10 });
      expect(placedIngredient.size).toEqual(mockIngredient.defaultSize);
    });

    test('should generate different IDs for multiple placed ingredients', () => {
      const input1: CreatePlacedIngredientInput = {
        ingredientId: 'ingredient-1',
        partitionId: 'partition-1',
        position: { x: 10, y: 10 },
        size: { width: 40, height: 30 }
      };

      const input2: CreatePlacedIngredientInput = {
        ingredientId: 'ingredient-2',
        partitionId: 'partition-1',
        position: { x: 60, y: 60 },
        size: { width: 40, height: 30 }
      };

      const placed1 = PlacedIngredientService.createPlacedIngredient(input1);
      const placed2 = PlacedIngredientService.createPlacedIngredient(input2);

      expect(placed1.id).not.toBe(placed2.id);
    });
  });

  describe('Placement Validation', () => {
    const existingPlaced: PlacedIngredient = {
      id: 'placed-1',
      ingredientId: 'ingredient-2',
      position: { x: 50, y: 50 },
      size: { width: 40, height: 30 },
      partitionId: 'partition-1'
    };

    test('should validate ingredient fits within partition bounds', () => {
      const validPosition = { x: 10, y: 10 };
      const invalidPosition = { x: 140, y: 10 }; // Extends beyond partition boundary

      const validResult = PlacedIngredientService.canPlaceIngredient(
        mockIngredient,
        mockBentoBox.partitions[0],
        validPosition,
        []
      );

      const invalidResult = PlacedIngredientService.canPlaceIngredient(
        mockIngredient,
        mockBentoBox.partitions[0],
        invalidPosition,
        []
      );

      expect(validResult.canPlace).toBe(true);
      expect(invalidResult.canPlace).toBe(false);
      expect(invalidResult.reason).toContain('extends beyond partition bounds');
    });

    test('should detect overlaps with existing ingredients', () => {
      const overlappingPosition = { x: 55, y: 55 }; // Overlaps with existingPlaced
      const nonOverlappingPosition = { x: 100, y: 100 };

      const overlappingResult = PlacedIngredientService.canPlaceIngredient(
        mockIngredient,
        mockBentoBox.partitions[0],
        overlappingPosition,
        [existingPlaced]
      );

      const validResult = PlacedIngredientService.canPlaceIngredient(
        mockIngredient,
        mockBentoBox.partitions[0],
        nonOverlappingPosition,
        [existingPlaced]
      );

      expect(overlappingResult.canPlace).toBe(false);
      expect(overlappingResult.reason).toContain('overlaps with existing ingredient');
      expect(validResult.canPlace).toBe(true);
    });

    test('should only check overlaps within the same partition', () => {
      const positionInDifferentPartition = { x: 55, y: 55 };

      // existingPlaced is in partition-1, testing placement in partition-2
      const result = PlacedIngredientService.canPlaceIngredient(
        mockIngredient,
        mockBentoBox.partitions[1], // partition-2
        positionInDifferentPartition,
        [existingPlaced] // in partition-1
      );

      expect(result.canPlace).toBe(true);
    });
  });

  describe('Storage Integration', () => {
    test('should save placed ingredients to storage', async () => {
      const placedIngredients: PlacedIngredient[] = [
        {
          id: 'placed-1',
          ingredientId: 'ingredient-1',
          position: { x: 10, y: 10 },
          size: { width: 40, height: 30 },
          partitionId: 'partition-1'
        }
      ];

      mockStorageService.saveBentoState.mockResolvedValue();

      await PlacedIngredientService.saveToStorage(placedIngredients);

      expect(mockStorageService.saveBentoState).toHaveBeenCalledWith(placedIngredients);
    });

    test('should load placed ingredients from storage', async () => {
      const storedIngredients: PlacedIngredient[] = [
        {
          id: 'placed-1',
          ingredientId: 'ingredient-1',
          position: { x: 10, y: 10 },
          size: { width: 40, height: 30 },
          partitionId: 'partition-1'
        }
      ];

      mockStorageService.loadBentoState.mockResolvedValue(storedIngredients);

      const result = await PlacedIngredientService.loadFromStorage();

      expect(result).toEqual(storedIngredients);
      expect(mockStorageService.loadBentoState).toHaveBeenCalled();
    });

    test('should handle empty storage gracefully', async () => {
      mockStorageService.loadBentoState.mockResolvedValue([]);

      const result = await PlacedIngredientService.loadFromStorage();

      expect(result).toEqual([]);
    });
  });

  describe('PlacedIngredient Management', () => {
    test('should add placed ingredient to collection', () => {
      const existingIngredients: PlacedIngredient[] = [
        {
          id: 'placed-1',
          ingredientId: 'ingredient-1',
          position: { x: 10, y: 10 },
          size: { width: 40, height: 30 },
          partitionId: 'partition-1'
        }
      ];

      const newIngredient: PlacedIngredient = {
        id: 'placed-2',
        ingredientId: 'ingredient-2',
        position: { x: 100, y: 100 },
        size: { width: 40, height: 30 },
        partitionId: 'partition-2'
      };

      const result = PlacedIngredientService.addPlacedIngredient(
        existingIngredients,
        newIngredient
      );

      expect(result).toHaveLength(2);
      expect(result).toContain(newIngredient);
      expect(result[0]).toBe(existingIngredients[0]); // Original should be unchanged
    });

    test('should remove placed ingredient by ID', () => {
      const ingredients: PlacedIngredient[] = [
        {
          id: 'placed-1',
          ingredientId: 'ingredient-1',
          position: { x: 10, y: 10 },
          size: { width: 40, height: 30 },
          partitionId: 'partition-1'
        },
        {
          id: 'placed-2',
          ingredientId: 'ingredient-2',
          position: { x: 100, y: 100 },
          size: { width: 40, height: 30 },
          partitionId: 'partition-2'
        }
      ];

      const result = PlacedIngredientService.removePlacedIngredient(
        ingredients,
        'placed-1'
      );

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('placed-2');
    });

    test('should return original array if ID not found when removing', () => {
      const ingredients: PlacedIngredient[] = [
        {
          id: 'placed-1',
          ingredientId: 'ingredient-1',
          position: { x: 10, y: 10 },
          size: { width: 40, height: 30 },
          partitionId: 'partition-1'
        }
      ];

      const result = PlacedIngredientService.removePlacedIngredient(
        ingredients,
        'non-existent-id'
      );

      expect(result).toEqual(ingredients);
    });

    test('should get placed ingredients by partition ID', () => {
      const ingredients: PlacedIngredient[] = [
        {
          id: 'placed-1',
          ingredientId: 'ingredient-1',
          position: { x: 10, y: 10 },
          size: { width: 40, height: 30 },
          partitionId: 'partition-1'
        },
        {
          id: 'placed-2',
          ingredientId: 'ingredient-2',
          position: { x: 160, y: 10 },
          size: { width: 40, height: 30 },
          partitionId: 'partition-2'
        }
      ];

      const partition1Results = PlacedIngredientService.getByPartition(
        ingredients,
        'partition-1'
      );

      const partition2Results = PlacedIngredientService.getByPartition(
        ingredients,
        'partition-2'
      );

      expect(partition1Results).toHaveLength(1);
      expect(partition1Results[0].id).toBe('placed-1');
      expect(partition2Results).toHaveLength(1);
      expect(partition2Results[0].id).toBe('placed-2');
    });
  });
});