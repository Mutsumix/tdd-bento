import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PlacedIngredientItem } from '@/components/BentoBoxCanvas/PlacedIngredientItem';
import { PlacedIngredient, Ingredient } from '@/types';

// Mock IngredientService
jest.mock('@/services/ingredientService', () => ({
  IngredientService: {
    findById: jest.fn()
  }
}));

const mockIngredientService = require('@/services/ingredientService').IngredientService;

// Mock data
const mockIngredient: Ingredient = {
  id: 'ingredient-1',
  name: '唐揚げ',
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
};

const mockPlacedIngredient: PlacedIngredient = {
  id: 'placed-1',
  ingredientId: 'ingredient-1',
  partitionId: 'partition-1',
  position: { x: 10, y: 20 },
  size: { width: 40, height: 30 }
};

describe('PlacedIngredientItem', () => {
  beforeEach(() => {
    mockIngredientService.findById.mockReturnValue(mockIngredient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render with correct testID', () => {
    const { getByTestId } = render(
      <PlacedIngredientItem 
        placedIngredient={mockPlacedIngredient}
      />
    );
    
    expect(getByTestId(`placed-ingredient-${mockPlacedIngredient.id}`)).toBeTruthy();
  });

  it('should display ingredient name', () => {
    const { getByTestId } = render(
      <PlacedIngredientItem 
        placedIngredient={mockPlacedIngredient}
      />
    );
    
    const nameElement = getByTestId(`ingredient-name-${mockIngredient.id}`);
    expect(nameElement.props.children).toBe('唐揚げ');
  });

  it('should display ingredient icon', () => {
    const { getByTestId } = render(
      <PlacedIngredientItem 
        placedIngredient={mockPlacedIngredient}
      />
    );
    
    expect(getByTestId(`ingredient-icon-${mockIngredient.id}`)).toBeTruthy();
  });

  it('should position correctly using placedIngredient position', () => {
    const { getByTestId } = render(
      <PlacedIngredientItem 
        placedIngredient={mockPlacedIngredient}
      />
    );
    
    const container = getByTestId(`placed-ingredient-${mockPlacedIngredient.id}`);
    const styles = container.props.style;
    
    expect(styles).toMatchObject({
      position: 'absolute',
      left: 10,
      top: 20,
      width: 40,
      height: 30
    });
  });

  it('should call onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <PlacedIngredientItem 
        placedIngredient={mockPlacedIngredient}
        onPress={mockOnPress}
      />
    );
    
    fireEvent.press(getByTestId(`placed-ingredient-${mockPlacedIngredient.id}`));
    expect(mockOnPress).toHaveBeenCalledWith(mockPlacedIngredient);
  });

  it('should not call onPress when onPress is not provided', () => {
    expect(() => {
      const { getByTestId } = render(
        <PlacedIngredientItem 
          placedIngredient={mockPlacedIngredient}
        />
      );
      
      fireEvent.press(getByTestId(`placed-ingredient-${mockPlacedIngredient.id}`));
    }).not.toThrow();
  });

  it('should apply ingredient color to icon', () => {
    const { getByTestId } = render(
      <PlacedIngredientItem 
        placedIngredient={mockPlacedIngredient}
      />
    );
    
    const icon = getByTestId(`ingredient-icon-${mockIngredient.id}`);
    const styles = icon.props.style;
    
    expect(styles).toMatchObject({
      backgroundColor: expect.stringContaining('#') // Should be a color value
    });
  });

  it('should use ingredient size for dimensions', () => {
    const { getByTestId } = render(
      <PlacedIngredientItem 
        placedIngredient={mockPlacedIngredient}
      />
    );
    
    const container = getByTestId(`placed-ingredient-${mockPlacedIngredient.id}`);
    const styles = container.props.style;
    
    expect(styles.width).toBe(mockPlacedIngredient.size.width);
    expect(styles.height).toBe(mockPlacedIngredient.size.height);
  });

  it('should render accessible name text', () => {
    const { getByTestId } = render(
      <PlacedIngredientItem 
        placedIngredient={mockPlacedIngredient}
      />
    );
    
    const nameText = getByTestId(`ingredient-name-${mockIngredient.id}`);
    expect(nameText.props.children).toBe('唐揚げ');
  });

  it('should be touchable when onPress is provided', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <PlacedIngredientItem 
        placedIngredient={mockPlacedIngredient}
        onPress={mockOnPress}
      />
    );
    
    const container = getByTestId(`placed-ingredient-${mockPlacedIngredient.id}`);
    // In test environment, TouchableOpacity renders as button
    expect(container.type).toBe('button');
  });

  it('should not be touchable when onPress is not provided', () => {
    const { getByTestId } = render(
      <PlacedIngredientItem 
        placedIngredient={mockPlacedIngredient}
      />
    );
    
    const container = getByTestId(`placed-ingredient-${mockPlacedIngredient.id}`);
    // In test environment, View renders as div
    expect(container.type).toBe('div');
  });

  it('should call IngredientService.findById with correct ingredientId', () => {
    render(
      <PlacedIngredientItem 
        placedIngredient={mockPlacedIngredient}
      />
    );
    
    expect(mockIngredientService.findById).toHaveBeenCalledWith('ingredient-1');
  });

  it('should handle missing ingredient gracefully', () => {
    mockIngredientService.findById.mockReturnValue(null);
    
    const { getByTestId } = render(
      <PlacedIngredientItem 
        placedIngredient={mockPlacedIngredient}
      />
    );
    
    const container = getByTestId(`placed-ingredient-${mockPlacedIngredient.id}`);
    expect(container).toBeTruthy();
  });
});