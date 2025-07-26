import React from 'react';
import { render } from '@testing-library/react-native';
import { BentoBoxCanvas } from '@/components/BentoBoxCanvas';
import { BentoBox, PlacedIngredient } from '@/types';
import { createBentoBox } from '@/utils/bentoBox';

describe('BentoBoxCanvas', () => {
  const defaultBentoBox: BentoBox = createBentoBox({
    type: 'rectangle',
    dimensions: { width: 300, height: 200 }
  });

  const placedIngredients: PlacedIngredient[] = [];

  describe('Basic rendering', () => {
    it('should render without crashing', () => {
      const { toJSON } = render(
        <BentoBoxCanvas 
          bentoBox={defaultBentoBox}
          placedIngredients={placedIngredients}
        />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should render with correct structure', () => {
      const { toJSON } = render(
        <BentoBoxCanvas 
          bentoBox={defaultBentoBox}
          placedIngredients={placedIngredients}
        />
      );
      
      const tree = toJSON();
      expect(tree).toBeTruthy();
      // Verify it's a View component
      expect(tree.type).toBe('div');
      // Has children for partitions
      expect(tree.children).toBeTruthy();
      expect(tree.children.length).toBe(defaultBentoBox.partitions.length);
    });
  });

  describe('Partition rendering', () => {
    it('should render correct number of partitions', () => {
      const { toJSON } = render(
        <BentoBoxCanvas 
          bentoBox={defaultBentoBox}
          placedIngredients={placedIngredients}
        />
      );
      
      const tree = toJSON();
      const children = tree.children || [];
      expect(children).toHaveLength(defaultBentoBox.partitions.length);
    });
  });

  describe('PlacedIngredient rendering', () => {
    it('should render placed ingredients', () => {
      const ingredientsWithItems: PlacedIngredient[] = [
        {
          id: 'placed-1',
          ingredientId: 'ingredient-001',
          partitionId: defaultBentoBox.partitions[0].id,
          position: { x: 10, y: 10 },
          size: { width: 50, height: 30 }
        },
        {
          id: 'placed-2',
          ingredientId: 'ingredient-002',
          partitionId: defaultBentoBox.partitions[1].id,
          position: { x: 160, y: 20 },
          size: { width: 45, height: 25 }
        }
      ];

      const { toJSON } = render(
        <BentoBoxCanvas 
          bentoBox={defaultBentoBox}
          placedIngredients={ingredientsWithItems}
        />
      );
      
      const tree = toJSON();
      const children = tree.children || [];
      // 2 partitions + 2 placed ingredients
      expect(children).toHaveLength(4);
    });
  });

  describe('Props validation', () => {
    it('should handle empty placed ingredients array', () => {
      const { toJSON } = render(
        <BentoBoxCanvas 
          bentoBox={defaultBentoBox}
          placedIngredients={[]}
        />
      );
      
      const tree = toJSON();
      expect(tree).toBeTruthy();
    });

    it('should accept onIngredientPress callback', () => {
      const onPress = jest.fn();
      const placedIngredient: PlacedIngredient = {
        id: 'placed-1',
        ingredientId: 'ingredient-001',
        partitionId: defaultBentoBox.partitions[0].id,
        position: { x: 10, y: 10 },
        size: { width: 50, height: 30 }
      };

      const { toJSON } = render(
        <BentoBoxCanvas 
          bentoBox={defaultBentoBox}
          placedIngredients={[placedIngredient]}
          onIngredientPress={onPress}
        />
      );
      
      const tree = toJSON();
      expect(tree).toBeTruthy();
      // Find the button (TouchableOpacity)
      const buttons = tree.children.filter((child: any) => child.type === 'button');
      expect(buttons).toHaveLength(1);
    });
  });
});