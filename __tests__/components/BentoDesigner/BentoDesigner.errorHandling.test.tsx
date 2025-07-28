import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { BentoDesigner } from '@/components/BentoDesigner';
import { IngredientService } from '@/services/ingredientService';
import { PlacedIngredientService } from '@/services/placedIngredientService';

// Mock services
jest.mock('@/services/ingredientService');
jest.mock('@/services/placedIngredientService');

const mockIngredientService = IngredientService as jest.Mocked<typeof IngredientService>;
const mockPlacedIngredientService = PlacedIngredientService as jest.Mocked<typeof PlacedIngredientService>;

const mockIngredient = {
  id: 'test-ingredient',
  name: 'テスト食材',
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

describe('BentoDesigner Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default successful mocks
    mockIngredientService.initializeForTesting.mockImplementation(() => {});
    mockIngredientService.getAllWithUserIngredients.mockResolvedValue([mockIngredient]);
    mockIngredientService.loadUserIngredients.mockResolvedValue();
    mockPlacedIngredientService.loadFromStorage.mockResolvedValue([]);
    mockPlacedIngredientService.saveToStorage.mockResolvedValue();
  });

  describe('Ingredient Save Error Handling', () => {
    it('should display error message when ingredient save fails', async () => {
      mockIngredientService.addUserIngredient.mockRejectedValue(new Error('Storage failed'));
      
      const { getByTestId, queryByTestId } = render(<BentoDesigner />);
      
      // Wait for component to load
      await waitFor(() => {
        expect(getByTestId('action-add-ingredient')).toBeTruthy();
      });
      
      // Open add ingredient modal
      fireEvent.press(getByTestId('action-add-ingredient'));
      
      await waitFor(() => {
        expect(getByTestId('add-ingredient-modal')).toBeTruthy();
      });
      
      // Fill form with valid data
      fireEvent.changeText(getByTestId('ingredient-name-input'), 'テスト食材');
      fireEvent.changeText(getByTestId('ingredient-category-input'), 'main');
      fireEvent.changeText(getByTestId('ingredient-vitamin-input'), '10');
      fireEvent.changeText(getByTestId('ingredient-protein-input'), '20');
      fireEvent.changeText(getByTestId('ingredient-fiber-input'), '5');
      fireEvent.changeText(getByTestId('ingredient-cooking-time-input'), '30');
      fireEvent.changeText(getByTestId('ingredient-cost-input'), '200');
      
      // Try to save
      fireEvent.press(getByTestId('save-ingredient'));
      
      // Error message should appear
      await waitFor(() => {
        expect(getByTestId('error-message')).toBeTruthy();
        expect(queryByTestId('error-message')).toHaveTextContent('食材の保存に失敗しました。もう一度お試しください。');
      });
    });

    it('should dismiss error message when close button is pressed', async () => {
      mockIngredientService.addUserIngredient.mockRejectedValue(new Error('Storage failed'));
      
      const { getByTestId, queryByTestId } = render(<BentoDesigner />);
      
      // Trigger error (same steps as above)
      await waitFor(() => {
        expect(getByTestId('action-add-ingredient')).toBeTruthy();
      });
      
      fireEvent.press(getByTestId('action-add-ingredient'));
      
      await waitFor(() => {
        expect(getByTestId('add-ingredient-modal')).toBeTruthy();
      });
      
      fireEvent.changeText(getByTestId('ingredient-name-input'), 'テスト食材');
      fireEvent.changeText(getByTestId('ingredient-category-input'), 'main');
      fireEvent.changeText(getByTestId('ingredient-vitamin-input'), '10');
      fireEvent.changeText(getByTestId('ingredient-protein-input'), '20');
      fireEvent.changeText(getByTestId('ingredient-fiber-input'), '5');
      fireEvent.changeText(getByTestId('ingredient-cooking-time-input'), '30');
      fireEvent.changeText(getByTestId('ingredient-cost-input'), '200');
      
      fireEvent.press(getByTestId('save-ingredient'));
      
      await waitFor(() => {
        expect(getByTestId('error-message')).toBeTruthy();
      });
      
      // Close error message
      fireEvent.press(getByTestId('error-message-close'));
      
      // Error message should disappear
      await waitFor(() => {
        expect(queryByTestId('error-message')).toBeNull();
      });
    });
  });

  describe('Clear Operation Error Handling', () => {
    it('should display error message when clear operation fails', async () => {
      mockPlacedIngredientService.saveToStorage.mockRejectedValue(new Error('Clear failed'));
      
      const { getByTestId, queryByTestId } = render(<BentoDesigner />);
      
      await waitFor(() => {
        expect(getByTestId('action-clear')).toBeTruthy();
      });
      
      // Try to clear
      fireEvent.press(getByTestId('action-clear'));
      
      // Error message should appear
      await waitFor(() => {
        expect(getByTestId('error-message')).toBeTruthy();
        expect(queryByTestId('error-message')).toHaveTextContent('クリア操作に失敗しました。もう一度お試しください。');
      });
    });
  });

  describe('Storage Load Error Handling', () => {
    it('should display error message when storage load fails', async () => {
      mockPlacedIngredientService.loadFromStorage.mockRejectedValue(new Error('Load failed'));
      mockIngredientService.getAllWithUserIngredients.mockRejectedValue(new Error('Load failed'));
      
      const { getByTestId, queryByTestId } = render(<BentoDesigner />);
      
      // Error message should appear during component initialization
      await waitFor(() => {
        expect(getByTestId('error-message')).toBeTruthy();
        expect(queryByTestId('error-message')).toHaveTextContent('データの読み込みに失敗しました。アプリを再起動してください。');
      });
    });
  });

  describe('Auto-dismiss Feature', () => {
    it('should auto-dismiss error message after 5 seconds', async () => {
      mockIngredientService.addUserIngredient.mockRejectedValue(new Error('Storage failed'));
      
      const { getByTestId, queryByTestId } = render(<BentoDesigner />);
      
      // Trigger error
      await waitFor(() => {
        expect(getByTestId('action-add-ingredient')).toBeTruthy();
      });
      
      fireEvent.press(getByTestId('action-add-ingredient'));
      
      await waitFor(() => {
        expect(getByTestId('add-ingredient-modal')).toBeTruthy();
      });
      
      fireEvent.changeText(getByTestId('ingredient-name-input'), 'テスト食材');
      fireEvent.changeText(getByTestId('ingredient-category-input'), 'main');
      fireEvent.changeText(getByTestId('ingredient-vitamin-input'), '10');
      fireEvent.changeText(getByTestId('ingredient-protein-input'), '20');
      fireEvent.changeText(getByTestId('ingredient-fiber-input'), '5');
      fireEvent.changeText(getByTestId('ingredient-cooking-time-input'), '30');
      fireEvent.changeText(getByTestId('ingredient-cost-input'), '200');
      
      fireEvent.press(getByTestId('save-ingredient'));
      
      await waitFor(() => {
        expect(getByTestId('error-message')).toBeTruthy();
      });
      
      // Wait for auto-dismiss (5 seconds + buffer)
      await waitFor(() => {
        expect(queryByTestId('error-message')).toBeNull();
      }, { timeout: 6000 });
    });
  });
});