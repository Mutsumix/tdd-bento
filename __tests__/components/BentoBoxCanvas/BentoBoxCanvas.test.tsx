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

    it('should render bento box container with correct dimensions', () => {
      const { getByTestId } = render(
        <BentoBoxCanvas 
          bentoBox={defaultBentoBox}
          placedIngredients={placedIngredients}
        />
      );
      
      const container = getByTestId('bento-box-container');
      expect(container).toBeTruthy();
      expect(container.props.style).toMatchObject({
        width: 300,
        height: 200
      });
    });
  });

  describe('Partition rendering', () => {
    it('should render partitions', () => {
      const { getAllByTestId } = render(
        <BentoBoxCanvas 
          bentoBox={defaultBentoBox}
          placedIngredients={placedIngredients}
        />
      );
      
      const partitions = getAllByTestId(/^partition-/);
      expect(partitions).toHaveLength(defaultBentoBox.partitions.length);
    });

    it('should render each partition with correct bounds', () => {
      const { getByTestId } = render(
        <BentoBoxCanvas 
          bentoBox={defaultBentoBox}
          placedIngredients={placedIngredients}
        />
      );
      
      defaultBentoBox.partitions.forEach((partition) => {
        const partitionElement = getByTestId(`partition-${partition.id}`);
        expect(partitionElement).toBeTruthy();
        expect(partitionElement.props.style).toMatchObject({
          position: 'absolute',
          left: partition.bounds.x,
          top: partition.bounds.y,
          width: partition.bounds.width,
          height: partition.bounds.height
        });
      });
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

      const { getAllByTestId } = render(
        <BentoBoxCanvas 
          bentoBox={defaultBentoBox}
          placedIngredients={ingredientsWithItems}
        />
      );
      
      const placedItems = getAllByTestId(/^placed-ingredient-/);
      expect(placedItems).toHaveLength(2);
    });

    it('should position placed ingredients correctly', () => {
      const placedIngredient: PlacedIngredient = {
        id: 'placed-1',
        ingredientId: 'ingredient-001',
        partitionId: defaultBentoBox.partitions[0].id,
        position: { x: 10, y: 10 },
        size: { width: 50, height: 30 }
      };

      const { getByTestId } = render(
        <BentoBoxCanvas 
          bentoBox={defaultBentoBox}
          placedIngredients={[placedIngredient]}
        />
      );
      
      const placedItem = getByTestId(`placed-ingredient-${placedIngredient.id}`);
      expect(placedItem.props.style).toMatchObject({
        position: 'absolute',
        left: 10,
        top: 10,
        width: 50,
        height: 30
      });
    });
  });

  describe('Props validation', () => {
    it('should handle empty placed ingredients array', () => {
      const { queryByTestId } = render(
        <BentoBoxCanvas 
          bentoBox={defaultBentoBox}
          placedIngredients={[]}
        />
      );
      
      const placedItem = queryByTestId(/^placed-ingredient-/);
      expect(placedItem).toBeNull();
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

      const { getByTestId } = render(
        <BentoBoxCanvas 
          bentoBox={defaultBentoBox}
          placedIngredients={[placedIngredient]}
          onIngredientPress={onPress}
        />
      );
      
      const placedItem = getByTestId(`placed-ingredient-${placedIngredient.id}`);
      expect(placedItem).toBeTruthy();
    });
  });
});