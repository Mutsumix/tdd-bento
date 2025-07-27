import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { BentoDesigner } from '@/components/BentoDesigner';
import { IngredientService } from '@/services/ingredientService';
import { PlacedIngredientService } from '@/services/placedIngredientService';
import { SuggestionService } from '@/services/suggestionService';

// Mock services
jest.mock('@/services/ingredientService');
jest.mock('@/services/placedIngredientService');
jest.mock('@/services/suggestionService');

const mockIngredientService = IngredientService as jest.Mocked<typeof IngredientService>;
const mockPlacedIngredientService = PlacedIngredientService as jest.Mocked<typeof PlacedIngredientService>;
const mockSuggestionService = SuggestionService as jest.Mocked<typeof SuggestionService>;

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

const mockSuggestionResult = {
  ingredient: mockIngredient,
  score: 85,
  reason: '冷凍食品で時短調理が可能'
};

const mockSuggestions = [
  mockSuggestionResult,
  {
    ingredient: { ...mockIngredient, id: 'chicken', name: '鶏肉' },
    score: 80,
    reason: 'タンパク質豊富'
  }
];

describe('BentoDesigner Suggestion Adoption', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup service mocks
    mockIngredientService.initializeForTesting.mockImplementation(() => {});
    mockIngredientService.getAllWithUserIngredients.mockResolvedValue([mockIngredient]);
    mockIngredientService.loadUserIngredients.mockResolvedValue();
    
    mockPlacedIngredientService.loadFromStorage.mockResolvedValue([]);
    mockPlacedIngredientService.saveToStorage.mockResolvedValue();
    mockPlacedIngredientService.createPlacedIngredient.mockImplementation((input) => ({
      id: `placed-${Date.now()}`,
      ...input
    }));
    
    mockSuggestionService.getSuggestionsWithScores.mockReturnValue(mockSuggestions);
  });

  describe('Suggestion Modal Integration', () => {
    it('should open suggestion modal when suggestion button is pressed', async () => {
      const { getByTestId } = render(<BentoDesigner />);
      
      await waitFor(() => {
        expect(getByTestId('action-suggestion')).toBeTruthy();
      });

      // Open suggestion modal
      fireEvent.press(getByTestId('action-suggestion'));
      
      // Modal should be visible
      expect(getByTestId('suggestion-modal')).toBeTruthy();
    });

    it('should display suggestion results in modal', async () => {
      const { getByTestId } = render(<BentoDesigner />);
      
      await waitFor(() => {
        expect(getByTestId('action-suggestion')).toBeTruthy();
      });

      // Open suggestion modal
      fireEvent.press(getByTestId('action-suggestion'));
      
      await waitFor(() => {
        expect(getByTestId('suggestion-modal')).toBeTruthy();
      });

      // Should call SuggestionService to get suggestions
      expect(mockSuggestionService.getSuggestionsWithScores).toHaveBeenCalled();
    });
  });

  describe('Suggestion Adoption', () => {
    it('should place suggested ingredient when adopting suggestion', async () => {
      const { getByTestId } = render(<BentoDesigner />);
      
      await waitFor(() => {
        expect(getByTestId('action-suggestion')).toBeTruthy();
      });

      // Open suggestion modal
      fireEvent.press(getByTestId('action-suggestion'));
      
      await waitFor(() => {
        expect(getByTestId('suggestion-modal')).toBeTruthy();
      });

      // Adopt the suggestion
      fireEvent.press(getByTestId('suggestion-adopt'));
      
      // Should create placed ingredient from suggestion
      await waitFor(() => {
        expect(mockPlacedIngredientService.createPlacedIngredient).toHaveBeenCalledWith({
          ingredientId: mockSuggestionResult.ingredient.id,
          partitionId: expect.any(String),
          position: expect.any(Object),
          size: mockSuggestionResult.ingredient.defaultSize
        });
      });
    });

    it('should save placed ingredients to storage after adoption', async () => {
      const { getByTestId } = render(<BentoDesigner />);
      
      await waitFor(() => {
        expect(getByTestId('action-suggestion')).toBeTruthy();
      });

      // Open suggestion modal
      fireEvent.press(getByTestId('action-suggestion'));
      
      await waitFor(() => {
        expect(getByTestId('suggestion-modal')).toBeTruthy();
      });

      // Adopt the suggestion
      fireEvent.press(getByTestId('suggestion-adopt'));
      
      // Should save to storage
      await waitFor(() => {
        expect(mockPlacedIngredientService.saveToStorage).toHaveBeenCalled();
      });
    });

    it('should close modal after successful adoption', async () => {
      const { getByTestId, queryByTestId } = render(<BentoDesigner />);
      
      await waitFor(() => {
        expect(getByTestId('action-suggestion')).toBeTruthy();
      });

      // Open suggestion modal
      fireEvent.press(getByTestId('action-suggestion'));
      
      await waitFor(() => {
        expect(getByTestId('suggestion-modal')).toBeTruthy();
      });

      // Adopt the suggestion
      fireEvent.press(getByTestId('suggestion-adopt'));
      
      // Modal should be closed
      await waitFor(() => {
        expect(queryByTestId('suggestion-modal')).toBeFalsy();
      });
    });

    it('should clear existing placed ingredients before adopting suggestion', async () => {
      // Setup existing placed ingredients
      const existingPlaced = {
        id: 'existing-1',
        ingredientId: 'existing-ingredient',
        partitionId: 'main',
        position: { x: 0, y: 0 },
        size: { width: 40, height: 30 }
      };
      
      mockPlacedIngredientService.loadFromStorage.mockResolvedValue([existingPlaced]);
      
      const { getByTestId } = render(<BentoDesigner />);
      
      await waitFor(() => {
        expect(getByTestId('action-suggestion')).toBeTruthy();
      });

      // Open suggestion modal
      fireEvent.press(getByTestId('action-suggestion'));
      
      await waitFor(() => {
        expect(getByTestId('suggestion-modal')).toBeTruthy();
      });

      // Adopt the suggestion
      fireEvent.press(getByTestId('suggestion-adopt'));
      
      // Should save only the new suggestion (clearing existing)
      await waitFor(() => {
        expect(mockPlacedIngredientService.saveToStorage).toHaveBeenCalledWith(
          expect.arrayContaining([
            expect.objectContaining({
              ingredientId: mockSuggestionResult.ingredient.id
            })
          ])
        );
      });
    });
  });

  describe('Multiple Suggestions Support', () => {
    it('should place multiple ingredients when adopting comprehensive suggestion', async () => {
      const { getByTestId } = render(<BentoDesigner />);
      
      await waitFor(() => {
        expect(getByTestId('action-suggestion')).toBeTruthy();
      });

      // Open suggestion modal
      fireEvent.press(getByTestId('action-suggestion'));
      
      await waitFor(() => {
        expect(getByTestId('suggestion-modal')).toBeTruthy();
      });

      // Adopt comprehensive suggestion (multiple ingredients)
      fireEvent.press(getByTestId('suggestion-adopt-all'));
      
      // Should create multiple placed ingredients
      await waitFor(() => {
        expect(mockPlacedIngredientService.createPlacedIngredient).toHaveBeenCalledTimes(
          mockSuggestions.length
        );
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle storage errors gracefully during adoption', async () => {
      mockPlacedIngredientService.saveToStorage.mockRejectedValue(new Error('Storage failed'));
      
      const { getByTestId } = render(<BentoDesigner />);
      
      await waitFor(() => {
        expect(getByTestId('action-suggestion')).toBeTruthy();
      });

      // Open suggestion modal
      fireEvent.press(getByTestId('action-suggestion'));
      
      await waitFor(() => {
        expect(getByTestId('suggestion-modal')).toBeTruthy();
      });

      // Adopt the suggestion (should not crash on error)
      expect(() => fireEvent.press(getByTestId('suggestion-adopt'))).not.toThrow();
    });
  });
});