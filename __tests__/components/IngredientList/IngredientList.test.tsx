import React from 'react';
import { render } from '@testing-library/react-native';
import { IngredientList } from '@/components/IngredientList';
import { Ingredient } from '@/types';
import { getInitialIngredients } from '@/data/initialIngredients';

describe('IngredientList', () => {
  const mockIngredients: Ingredient[] = getInitialIngredients().slice(0, 5); // Use first 5 for testing

  describe('Basic rendering', () => {
    it('should render without crashing', () => {
      const { toJSON } = render(
        <IngredientList 
          ingredients={mockIngredients}
        />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should render as ScrollView for horizontal scrolling', () => {
      const { toJSON } = render(
        <IngredientList 
          ingredients={mockIngredients}
        />
      );
      
      const tree = toJSON();
      expect(tree).toBeTruthy();
      expect(tree.type).toBe('div'); // ScrollView mocked as div
      expect(tree.props.horizontal).toBe(true);
    });

    it('should have ingredient-list testID', () => {
      const { getByTestId } = render(
        <IngredientList 
          ingredients={mockIngredients}
        />
      );
      
      const list = getByTestId('ingredient-list');
      expect(list).toBeTruthy();
    });
  });

  describe('Ingredient items rendering', () => {
    it('should render correct number of ingredient items', () => {
      const { toJSON } = render(
        <IngredientList 
          ingredients={mockIngredients}
        />
      );
      
      const tree = toJSON();
      const children = tree.children || [];
      expect(children).toHaveLength(mockIngredients.length);
    });

    it('should render IngredientItem with correct ingredients', () => {
      const { getAllByTestId } = render(
        <IngredientList 
          ingredients={mockIngredients}
        />
      );
      
      const ingredientItems = getAllByTestId(/^ingredient-item-/);
      expect(ingredientItems).toHaveLength(mockIngredients.length);
    });

    it('should pass ingredient data to IngredientItem components', () => {
      const singleIngredient = [mockIngredients[0]];
      const { getByTestId } = render(
        <IngredientList 
          ingredients={singleIngredient}
        />
      );
      
      const ingredientItem = getByTestId(`ingredient-item-${singleIngredient[0].id}`);
      expect(ingredientItem).toBeTruthy();
    });
  });

  // Note: Category filtering tests will be added in future iterations
  // when the filtering functionality is implemented

  describe('Props validation', () => {
    it('should handle empty ingredients array', () => {
      const { toJSON } = render(
        <IngredientList 
          ingredients={[]}
        />
      );
      
      const tree = toJSON();
      expect(tree).toBeTruthy();
      const children = tree.children || [];
      expect(children).toHaveLength(0);
    });

    it('should accept onIngredientPress callback', () => {
      const onPress = jest.fn();
      const { toJSON } = render(
        <IngredientList 
          ingredients={mockIngredients}
          onIngredientPress={onPress}
        />
      );
      
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Styling and layout', () => {
    it('should have proper scroll view styling', () => {
      const { getByTestId } = render(
        <IngredientList 
          ingredients={mockIngredients}
        />
      );
      
      const list = getByTestId('ingredient-list');
      expect(list.props.style).toBeTruthy();
    });

    it('should show scroll indicators', () => {
      const { getByTestId } = render(
        <IngredientList 
          ingredients={mockIngredients}
        />
      );
      
      const list = getByTestId('ingredient-list');
      expect(list.props.showsHorizontalScrollIndicator).toBe(true);
    });
  });
});