import { BentoBox, Partition, PlacedIngredient } from '@/types';
import { 
  createBentoBox, 
  validateBentoBox, 
  createPartition,
  validatePartition,
  createPlacedIngredient,
  validatePlacedIngredient,
  canPlaceIngredientInPartition,
  placeIngredientInBentoBox
} from '@/utils/bentoBox';

describe('BentoBox Model', () => {
  const validBentoBoxData = {
    id: 'bento-1',
    type: 'rectangle' as const,
    dimensions: { width: 300, height: 200 },
    partitions: []
  };

  const validPartitionData = {
    id: 'partition-1',
    type: 'rice' as const,
    bounds: { x: 0, y: 0, width: 150, height: 200 }
  };

  const validPlacedIngredientData = {
    id: 'placed-1',
    ingredientId: 'ingredient-1',
    position: { x: 10, y: 10 },
    size: { width: 40, height: 30 },
    partitionId: 'partition-1'
  };

  describe('BentoBox interface', () => {
    it('should have correct type structure', () => {
      const bentoBox: BentoBox = validBentoBoxData;
      expect(bentoBox.id).toBe('bento-1');
      expect(bentoBox.type).toBe('rectangle');
      expect(bentoBox.dimensions.width).toBe(300);
    });
  });

  describe('createBentoBox', () => {
    it('should create a basic rectangle bento box with default partitions', () => {
      const bentoBox = createBentoBox({
        type: 'rectangle',
        dimensions: { width: 300, height: 200 }
      });
      
      expect(bentoBox.id).toBeDefined();
      expect(bentoBox.type).toBe('rectangle');
      expect(bentoBox.partitions).toHaveLength(2); // rice and side partitions
      expect(bentoBox.partitions[0].type).toBe('rice');
      expect(bentoBox.partitions[1].type).toBe('side');
    });

    it('should create partitions with correct proportions for 2-split', () => {
      const bentoBox = createBentoBox({
        type: 'rectangle',
        dimensions: { width: 300, height: 200 }
      });
      
      const ricePartition = bentoBox.partitions.find(p => p.type === 'rice');
      const sidePartition = bentoBox.partitions.find(p => p.type === 'side');
      
      expect(ricePartition?.bounds.width).toBe(150); // Half width
      expect(sidePartition?.bounds.width).toBe(150); // Half width
      expect(ricePartition?.bounds.x).toBe(0);
      expect(sidePartition?.bounds.x).toBe(150);
    });
  });

  describe('validateBentoBox', () => {
    it('should validate correct bento box', () => {
      const result = validateBentoBox(validBentoBoxData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject bento box with invalid type', () => {
      const invalidBentoBox = {
        ...validBentoBoxData,
        type: 'invalid-type'
      };
      
      const result = validateBentoBox(invalidBentoBox);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('type must be one of: rectangle, oval, double');
    });

    it('should reject bento box with negative dimensions', () => {
      const invalidBentoBox = {
        ...validBentoBoxData,
        dimensions: { width: -100, height: 200 }
      };
      
      const result = validateBentoBox(invalidBentoBox);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('dimensions.width must be positive');
    });
  });

  describe('Partition operations', () => {
    describe('createPartition', () => {
      it('should create a valid partition', () => {
        const partition = createPartition({
          type: 'rice',
          bounds: { x: 0, y: 0, width: 150, height: 200 }
        });
        
        expect(partition.id).toBeDefined();
        expect(partition.type).toBe('rice');
        expect(partition.bounds.width).toBe(150);
      });
    });

    describe('validatePartition', () => {
      it('should validate correct partition', () => {
        const result = validatePartition(validPartitionData);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should reject partition with invalid type', () => {
        const invalidPartition = {
          ...validPartitionData,
          type: 'invalid'
        };
        
        const result = validatePartition(invalidPartition);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('type must be one of: rice, side');
      });
    });
  });

  describe('PlacedIngredient operations', () => {
    describe('createPlacedIngredient', () => {
      it('should create a valid placed ingredient', () => {
        const placed = createPlacedIngredient({
          ingredientId: 'ingredient-1',
          partitionId: 'partition-1',
          position: { x: 10, y: 10 },
          size: { width: 40, height: 30 }
        });
        
        expect(placed.id).toBeDefined();
        expect(placed.ingredientId).toBe('ingredient-1');
        expect(placed.partitionId).toBe('partition-1');
      });
    });

    describe('canPlaceIngredientInPartition', () => {
      it('should allow placement in valid area', () => {
        const partition: Partition = {
          id: 'partition-1',
          type: 'side',
          bounds: { x: 0, y: 0, width: 150, height: 200 }
        };
        
        const placedIngredient: PlacedIngredient = {
          id: 'placed-1',
          ingredientId: 'ingredient-1',
          position: { x: 10, y: 10 },
          size: { width: 40, height: 30 },
          partitionId: 'partition-1'
        };
        
        const result = canPlaceIngredientInPartition(placedIngredient, partition, []);
        expect(result.canPlace).toBe(true);
        expect(result.reason).toBeUndefined();
      });

      it('should reject placement outside partition bounds', () => {
        const partition: Partition = {
          id: 'partition-1',
          type: 'side',
          bounds: { x: 0, y: 0, width: 150, height: 200 }
        };
        
        const placedIngredient: PlacedIngredient = {
          id: 'placed-1',
          ingredientId: 'ingredient-1',
          position: { x: 140, y: 10 }, // Too far right
          size: { width: 40, height: 30 },
          partitionId: 'partition-1'
        };
        
        const result = canPlaceIngredientInPartition(placedIngredient, partition, []);
        expect(result.canPlace).toBe(false);
        expect(result.reason).toBe('ingredient extends outside partition bounds');
      });
    });

    describe('placeIngredientInBentoBox', () => {
      it('should successfully place ingredient in valid position', () => {
        const bentoBox = createBentoBox({
          type: 'rectangle',
          dimensions: { width: 300, height: 200 }
        });
        
        const result = placeIngredientInBentoBox(
          bentoBox,
          'ingredient-1',
          bentoBox.partitions[0].id,
          { x: 10, y: 10 },
          { width: 40, height: 30 }
        );
        
        expect(result.success).toBe(true);
        expect(result.placedIngredient).toBeDefined();
        expect(result.placedIngredient?.ingredientId).toBe('ingredient-1');
      });
    });
  });
});