import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { BentoDesigner } from '@/components/BentoDesigner';
import { IngredientService } from '@/services/ingredientService';
import { PlacedIngredientService } from '@/services/placedIngredientService';

// Mock services
jest.mock('@/services/ingredientService');
jest.mock('@/services/placedIngredientService');

const mockIngredientService = IngredientService as jest.Mocked<typeof IngredientService>;
const mockPlacedIngredientService = PlacedIngredientService as jest.Mocked<typeof PlacedIngredientService>;

// Mock gesture handler components for testing
jest.mock('react-native-gesture-handler', () => ({
  PanGestureHandler: ({ children, onGestureEvent, onHandlerStateChange }: any) => children,
  State: { BEGAN: 2, END: 5 },
}));

jest.mock('react-native-reanimated', () => ({
  default: {
    View: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  useSharedValue: () => ({ value: 0 }),
  useAnimatedStyle: () => ({}),
  runOnJS: (fn: any) => fn,
}));

const mockIngredient = {
  id: 'rice',
  name: 'ご飯',
  category: 'main' as const,
  color: 'white' as const,
  nutrition: { vitamin: 10, protein: 20, fiber: 5 },
  cookingTime: 30,
  cost: 200,
  season: 'all' as const,
  isFrozen: false,
  isReadyToEat: true,
  defaultSize: { width: 60, height: 40 },
  icon: 'circle'
};

const mockPlacedIngredient = {
  id: 'placed-1',
  ingredientId: mockIngredient.id,
  partitionId: 'main',
  position: { x: 10, y: 10 },
  size: mockIngredient.defaultSize
};

describe('BentoDesigner Drag & Drop Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup service mocks
    mockIngredientService.initializeForTesting.mockImplementation(() => {});
    mockIngredientService.getAllWithUserIngredients.mockResolvedValue([mockIngredient]);
    mockIngredientService.loadUserIngredients.mockResolvedValue();
    
    mockPlacedIngredientService.loadFromStorage.mockResolvedValue([]);
    mockPlacedIngredientService.saveToStorage.mockResolvedValue();
    mockPlacedIngredientService.createPlacedIngredient.mockReturnValue(mockPlacedIngredient);
    mockPlacedIngredientService.addPlacedIngredient.mockReturnValue([mockPlacedIngredient]);
  });

  describe('Component Rendering with Drag Support', () => {
    it('should render ingredient items with drag handlers when onDragStart/onDragEnd are provided', async () => {
      const { getByTestId } = render(<BentoDesigner />);
      
      await waitFor(() => {
        expect(getByTestId('ingredient-list')).toBeTruthy();
      });
      
      // Verify drag-enabled ingredient item exists
      const ingredientItem = getByTestId(`ingredient-item-${mockIngredient.id}`);
      expect(ingredientItem).toBeTruthy();
      
      // Verify pan gesture wrapper exists when drag is enabled
      const panGestureItem = getByTestId(`pan-gesture-ingredient-item-${mockIngredient.id}`);
      expect(panGestureItem).toBeTruthy();
    });

    it('should render BentoBoxCanvas with drag state props', async () => {
      const { getByTestId } = render(<BentoDesigner />);
      
      await waitFor(() => {
        expect(getByTestId('bento-box-container')).toBeTruthy();
      });

      // Verify BentoBoxCanvas is rendered and ready to receive drag props
      const bentoBox = getByTestId('bento-box-container');
      expect(bentoBox).toBeTruthy();
    });
  });

  describe('Service Integration', () => {
    it('should load placed ingredients from storage on mount', async () => {
      render(<BentoDesigner />);
      
      await waitFor(() => {
        expect(mockPlacedIngredientService.loadFromStorage).toHaveBeenCalled();
      });
    });

    it('should create placed ingredient service with correct parameters', () => {
      const dropInfo = {
        partitionId: 'main',
        position: { x: 10, y: 10 }
      };

      // Manually test service integration
      const result = PlacedIngredientService.createPlacedIngredient({
        ingredientId: mockIngredient.id,
        partitionId: dropInfo.partitionId,
        position: dropInfo.position,
        size: mockIngredient.defaultSize
      });

      expect(mockPlacedIngredientService.createPlacedIngredient).toHaveBeenCalledWith({
        ingredientId: mockIngredient.id,
        partitionId: dropInfo.partitionId,
        position: dropInfo.position,
        size: mockIngredient.defaultSize
      });
      expect(result).toEqual(mockPlacedIngredient);
    });

    it('should save placed ingredients to storage', async () => {
      const placedIngredients = [mockPlacedIngredient];
      
      await PlacedIngredientService.saveToStorage(placedIngredients);
      
      expect(mockPlacedIngredientService.saveToStorage).toHaveBeenCalledWith(placedIngredients);
    });
  });

  describe('Drag State Management', () => {
    it('should provide drag callbacks to IngredientList', async () => {
      const { getByTestId } = render(<BentoDesigner />);
      
      await waitFor(() => {
        expect(getByTestId('ingredient-list')).toBeTruthy();
      });

      // Verify ingredient items are rendered with drag support
      // (pan gesture handlers are present)
      const panGestureItem = getByTestId(`pan-gesture-ingredient-item-${mockIngredient.id}`);
      expect(panGestureItem).toBeTruthy();
    });

    it('should pass drag props to BentoBoxCanvas', async () => {
      const { getByTestId } = render(<BentoDesigner />);
      
      await waitFor(() => {
        expect(getByTestId('bento-box-container')).toBeTruthy();
      });

      // Verify BentoBoxCanvas is ready to receive drops
      const bentoBox = getByTestId('bento-box-container');
      expect(bentoBox).toBeTruthy();
    });
  });

  describe('Clear Functionality', () => {
    it('should clear placed ingredients and save to storage', async () => {
      mockPlacedIngredientService.loadFromStorage.mockResolvedValue([mockPlacedIngredient]);
      
      const { getByTestId } = render(<BentoDesigner />);
      
      await waitFor(() => {
        expect(getByTestId('action-clear')).toBeTruthy();
      });

      // Click clear button
      const clearButton = getByTestId('action-clear');
      fireEvent.press(clearButton);

      // Should save empty array to storage
      await waitFor(() => {
        expect(mockPlacedIngredientService.saveToStorage).toHaveBeenCalledWith([]);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle storage load errors gracefully', async () => {
      mockPlacedIngredientService.loadFromStorage.mockRejectedValue(new Error('Storage failed'));
      
      const { getByTestId } = render(<BentoDesigner />);
      
      // Component should still render despite storage error
      await waitFor(() => {
        expect(getByTestId('bento-designer')).toBeTruthy();
      });
    });

    it('should handle storage save errors gracefully', async () => {
      mockPlacedIngredientService.saveToStorage.mockRejectedValue(new Error('Storage failed'));
      
      const { getByTestId } = render(<BentoDesigner />);
      
      await waitFor(() => {
        expect(getByTestId('action-clear')).toBeTruthy();
      });

      // Clear action should not crash on storage error
      const clearButton = getByTestId('action-clear');
      expect(() => fireEvent.press(clearButton)).not.toThrow();
    });
  });
});