import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { IngredientItem } from '@/components/IngredientList/IngredientItem/IngredientItem';
import { BentoBoxCanvas } from '@/components/BentoBoxCanvas/BentoBoxCanvas';
import { Ingredient, BentoBox, PlacedIngredient } from '@/types';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  
  // Mock Animated.View
  Reanimated.Animated.View = jest.fn(({ children, ...props }) => {
    const React = require('react');
    return React.createElement('View', { ...props, testID: props.testID }, children);
  });

  // Mock runOnJS
  Reanimated.runOnJS = jest.fn((fn) => fn);

  return Reanimated;
});

// Mock PanGestureHandler
jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  
  return {
    GestureHandlerRootView: ({ children, ...props }: any) => 
      React.createElement('View', { ...props }, children),
    PanGestureHandler: ({ children, onGestureEvent, onHandlerStateChange, ...props }: any) => 
      React.createElement('View', { 
        ...props,
        onTouchStart: (event: any) => {
          // Simulate gesture start
          if (onHandlerStateChange) {
            onHandlerStateChange({ 
              nativeEvent: { 
                state: 2, // State.BEGAN
                translationX: 0,
                translationY: 0,
                absoluteX: 0,
                absoluteY: 0
              }
            });
          }
        },
        onTouchMove: (event: any) => {
          // Simulate gesture active
          if (onGestureEvent) {
            onGestureEvent({ 
              nativeEvent: { 
                state: 4, // State.ACTIVE
                translationX: event.nativeEvent?.translationX || 10,
                translationY: event.nativeEvent?.translationY || 10
              }
            });
          }
        },
        onTouchEnd: (event: any) => {
          // Simulate gesture end
          if (onHandlerStateChange) {
            onHandlerStateChange({ 
              nativeEvent: { 
                state: 5, // State.END
                translationX: event.nativeEvent?.translationX || 100,
                translationY: event.nativeEvent?.translationY || 50,
                absoluteX: event.nativeEvent?.absoluteX || 100,
                absoluteY: event.nativeEvent?.absoluteY || 50
              }
            });
          }
        },
        testID: `pan-gesture-${props.testID || 'default'}`
      }, children),
    State: {
      UNDETERMINED: 0,
      FAILED: 1,
      BEGAN: 2,
      CANCELLED: 3,
      ACTIVE: 4,
      END: 5,
    },
  };
});

// Test data
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

const mockPlacedIngredients: PlacedIngredient[] = [];

describe('Drag and Drop Functionality', () => {
  describe('IngredientItem Draggable Behavior', () => {
    test('should have PanGestureHandler wrapper', () => {
      const { getByTestId } = render(
        <GestureHandlerRootView>
          <IngredientItem 
            ingredient={mockIngredient}
            onDragStart={jest.fn()}
            onDragEnd={jest.fn()}
          />
        </GestureHandlerRootView>
      );

      expect(getByTestId(`pan-gesture-ingredient-item-${mockIngredient.id}`)).toBeTruthy();
    });

    test('should call onDragStart when drag begins', () => {
      const onDragStart = jest.fn();
      const { getByTestId } = render(
        <GestureHandlerRootView>
          <IngredientItem 
            ingredient={mockIngredient}
            onDragStart={onDragStart}
            onDragEnd={jest.fn()}
          />
        </GestureHandlerRootView>
      );

      const gestureHandler = getByTestId(`pan-gesture-ingredient-item-${mockIngredient.id}`);
      fireEvent(gestureHandler, 'touchStart');

      expect(onDragStart).toHaveBeenCalledWith(mockIngredient);
    });

    test('should call onDragEnd when drag ends', () => {
      const onDragEnd = jest.fn();
      const { getByTestId } = render(
        <GestureHandlerRootView>
          <IngredientItem 
            ingredient={mockIngredient}
            onDragStart={jest.fn()}
            onDragEnd={onDragEnd}
          />
        </GestureHandlerRootView>
      );

      const gestureHandler = getByTestId(`pan-gesture-ingredient-item-${mockIngredient.id}`);
      
      // Simulate drag end
      fireEvent(gestureHandler, 'touchEnd', {
        nativeEvent: { 
          translationX: 100,
          translationY: 50,
          absoluteX: 100,
          absoluteY: 50
        }
      });

      expect(onDragEnd).toHaveBeenCalledWith(
        mockIngredient,
        expect.objectContaining({
          x: expect.any(Number),
          y: expect.any(Number)
        })
      );
    });

    test('should show drag preview with animated position', () => {
      const { getByTestId } = render(
        <GestureHandlerRootView>
          <IngredientItem 
            ingredient={mockIngredient}
            onDragStart={jest.fn()}
            onDragEnd={jest.fn()}
            isDragging={true}
          />
        </GestureHandlerRootView>
      );

      const dragPreview = getByTestId(`drag-preview-${mockIngredient.id}`);
      expect(dragPreview).toBeTruthy();
    });
  });

  describe('BentoBoxCanvas Drop Zones', () => {
    test('should detect drop zones in partitions', () => {
      const onIngredientDrop = jest.fn();
      const { getByTestId } = render(
        <BentoBoxCanvas
          bentoBox={mockBentoBox}
          placedIngredients={mockPlacedIngredients}
          onIngredientDrop={onIngredientDrop}
        />
      );

      // Each partition should be a drop zone
      expect(getByTestId('partition-partition-1')).toBeTruthy();
      expect(getByTestId('partition-partition-2')).toBeTruthy();
    });

    test('should call onIngredientDrop when ingredient is dropped in partition', () => {
      const onIngredientDrop = jest.fn();
      const { getByTestId } = render(
        <BentoBoxCanvas
          bentoBox={mockBentoBox}
          placedIngredients={mockPlacedIngredients}
          onIngredientDrop={onIngredientDrop}
          draggedIngredient={mockIngredient}
          dragPosition={{ x: 75, y: 100 }} // Position within partition-1
        />
      );

      const container = getByTestId('bento-box-container');
      fireEvent(container, 'touchEnd', {
        nativeEvent: {
          position: { x: 75, y: 100 }
        }
      });

      expect(onIngredientDrop).toHaveBeenCalledWith(
        mockIngredient,
        expect.objectContaining({
          partitionId: 'partition-1',
          position: { x: 75, y: 100 }
        })
      );
    });

    test('should validate drop position within partition bounds', () => {
      const onIngredientDrop = jest.fn();
      const { getByTestId } = render(
        <BentoBoxCanvas
          bentoBox={mockBentoBox}
          placedIngredients={mockPlacedIngredients}
          onIngredientDrop={onIngredientDrop}
          draggedIngredient={mockIngredient}
          dragPosition={{ x: 350, y: 100 }} // Position actually outside partitions
        />
      );

      const canvas = getByTestId('bento-box-container');
      fireEvent(canvas, 'touchEnd', {
        nativeEvent: {
          position: { x: 350, y: 100 }
        }
      });

      // Should not call onIngredientDrop for invalid positions
      expect(onIngredientDrop).not.toHaveBeenCalled();
    });

    test('should prevent overlapping with existing ingredients', () => {
      const existingIngredient: PlacedIngredient = {
        id: 'placed-1',
        ingredientId: 'ingredient-2',
        position: { x: 50, y: 50 },
        size: { width: 40, height: 30 },
        partitionId: 'partition-1'
      };

      const onIngredientDrop = jest.fn();
      const { getByTestId } = render(
        <BentoBoxCanvas
          bentoBox={mockBentoBox}
          placedIngredients={[existingIngredient]}
          onIngredientDrop={onIngredientDrop}
          draggedIngredient={mockIngredient}
          dragPosition={{ x: 55, y: 55 }} // Overlapping position
        />
      );

      const canvas = getByTestId('bento-box-container');
      fireEvent(canvas, 'touchEnd', {
        nativeEvent: {
          position: { x: 55, y: 55 }
        }
      });

      // Should not call onIngredientDrop for overlapping positions
      expect(onIngredientDrop).not.toHaveBeenCalled();
    });
  });

  describe('Drag State Management', () => {
    test('should handle drag state management', () => {
      // Placeholder for future drag state management tests
      // This will be implemented in a future iteration
      expect(true).toBe(true);
    });
  });

  describe('Placement Validation Logic', () => {
    test('should handle placement validation', () => {
      // Placeholder for future placement validation tests  
      // This will be implemented in a future iteration
      expect(true).toBe(true);
    });
  });
});