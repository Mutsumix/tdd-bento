import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { BentoDesigner } from '@/components/BentoDesigner/BentoDesigner';
import { IngredientService } from '@/services/ingredientService';
import { StorageService } from '@/services/StorageService';
import { getInitialIngredients } from '@/data/initialIngredients';

// Mock dependencies
jest.mock('@/services/ingredientService', () => ({
  IngredientService: {
    getAllWithUserIngredients: jest.fn(),
    loadUserIngredients: jest.fn(),
    addUserIngredient: jest.fn(),
    initializeForTesting: jest.fn(),
  }
}));
jest.mock('@/services/StorageService');
jest.mock('@/data/initialIngredients', () => ({
  getInitialIngredients: jest.fn()
}));

describe('BentoDesigner - Add Ingredient Integration', () => {
  const mockInitialIngredients = [
    {
      id: 'karaage',
      name: '唐揚げ',
      category: 'main',
      color: 'brown',
      nutrition: { vitamin: 15, protein: 85, fiber: 10 },
      cookingTime: 15,
      cost: 200,
      season: 'all',
      isFrozen: false,
      isReadyToEat: false,
      defaultSize: { width: 40, height: 40 },
      icon: 'chicken',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (getInitialIngredients as jest.Mock).mockReturnValue(mockInitialIngredients);
    (IngredientService.getAllWithUserIngredients as jest.Mock).mockResolvedValue(mockInitialIngredients);
    (IngredientService.loadUserIngredients as jest.Mock).mockResolvedValue(undefined);
    (IngredientService.addUserIngredient as jest.Mock).mockResolvedValue({});
    (IngredientService.initializeForTesting as jest.Mock).mockReturnValue(undefined);
  });

  describe('AddIngredientModal integration', () => {
    it('should show add ingredient button in ActionBar', () => {
      const { getByTestId } = render(<BentoDesigner />);
      
      expect(getByTestId('action-add-ingredient')).toBeTruthy();
    });

    it('should open AddIngredientModal when add button is pressed', () => {
      const { getByTestId, queryByTestId } = render(<BentoDesigner />);
      
      // Modal should not be visible initially
      expect(queryByTestId('add-ingredient-modal')).toBeNull();
      
      // Press add ingredient button
      fireEvent.press(getByTestId('action-add-ingredient'));
      
      // Modal should now be visible
      expect(getByTestId('add-ingredient-modal')).toBeTruthy();
    });

    it('should save new ingredient when form is submitted', async () => {
      const mockNewIngredient = {
        id: 'user-ingredient-123',
        name: '新しい食材',
        category: 'side',
        color: 'green',
        nutrition: { vitamin: 50, protein: 50, fiber: 50 },
        cookingTime: 10,
        cost: 150,
        season: 'all',
        isFrozen: false,
        isReadyToEat: false,
        defaultSize: { width: 40, height: 30 },
        icon: 'circle',
      };

      (IngredientService.addUserIngredient as jest.Mock).mockResolvedValue(mockNewIngredient);
      (IngredientService.getAllWithUserIngredients as jest.Mock)
        .mockResolvedValueOnce(mockInitialIngredients)
        .mockResolvedValueOnce([...mockInitialIngredients, mockNewIngredient]);

      const { getByTestId } = render(<BentoDesigner />);
      
      // Open modal
      fireEvent.press(getByTestId('action-add-ingredient'));
      
      // Fill form (simplified - assuming form is filled)
      const nameInput = getByTestId('name-input');
      // In real implementation, this would be fireEvent.changeText
      // For now, we'll just verify the save flow
      
      // Press save button
      fireEvent.press(getByTestId('save-button'));
      
      await waitFor(() => {
        expect(IngredientService.addUserIngredient).toHaveBeenCalledWith(
          expect.objectContaining({
            name: expect.any(String),
            category: expect.any(String),
            color: expect.any(String),
          })
        );
      });
    });

    it('should update ingredient list after adding new ingredient', async () => {
      const mockNewIngredient = {
        id: 'user-ingredient-456',
        name: 'テスト食材',
        category: 'vegetable',
        color: 'green',
        nutrition: { vitamin: 70, protein: 30, fiber: 60 },
        cookingTime: 5,
        cost: 100,
        season: 'all',
        isFrozen: false,
        isReadyToEat: true,
        defaultSize: { width: 40, height: 30 },
        icon: 'circle',
      };

      (IngredientService.addUserIngredient as jest.Mock).mockResolvedValue(mockNewIngredient);
      (IngredientService.getAllWithUserIngredients as jest.Mock)
        .mockResolvedValueOnce(mockInitialIngredients)
        .mockResolvedValueOnce([...mockInitialIngredients, mockNewIngredient]);

      const { getByTestId, getByText } = render(<BentoDesigner />);
      
      // Open modal
      fireEvent.press(getByTestId('action-add-ingredient'));
      
      // Fill out form
      fireEvent.changeText(getByTestId('name-input'), 'テスト食材');
      fireEvent.press(getByTestId('category-vegetable'));
      fireEvent.press(getByTestId('color-green'));
      
      // Save
      fireEvent.press(getByTestId('save-button'));
      
      // Wait for ingredient list to update
      await waitFor(() => {
        expect(getByTestId('ingredient-item-user-ingredient-456')).toBeTruthy();
      });
    });

    it('should close modal after successful save', async () => {
      const mockNewIngredient = {
        id: 'user-ingredient-789',
        name: 'New Ingredient',
        category: 'vegetable',
        color: 'green',
        nutrition: { vitamin: 50, protein: 20, fiber: 30 },
        cookingTime: 5,
        cost: 100,
        season: 'all',
        isFrozen: false,
        isReadyToEat: false,
        defaultSize: { width: 40, height: 30 },
        icon: 'circle',
      };

      (IngredientService.addUserIngredient as jest.Mock).mockResolvedValue(mockNewIngredient);
      (IngredientService.getAllWithUserIngredients as jest.Mock)
        .mockResolvedValueOnce(mockInitialIngredients)
        .mockResolvedValueOnce([...mockInitialIngredients, mockNewIngredient]);

      const { getByTestId, queryByTestId } = render(<BentoDesigner />);
      
      // Wait for initial load to complete
      await waitFor(() => {
        expect(getByTestId('action-add-ingredient')).toBeTruthy();
      });
      
      // Open modal
      await act(async () => {
        fireEvent.press(getByTestId('action-add-ingredient'));
      });
      expect(getByTestId('add-ingredient-modal')).toBeTruthy();
      
      // Fill out form
      await act(async () => {
        fireEvent.changeText(getByTestId('name-input'), 'New Ingredient');
        fireEvent.press(getByTestId('category-vegetable'));
        fireEvent.press(getByTestId('color-green'));
      });
      
      // Save
      await act(async () => {
        fireEvent.press(getByTestId('save-button'));
      });
      
      // Modal should close after save
      await waitFor(() => {
        expect(queryByTestId('add-ingredient-modal')).toBeNull();
      }, { timeout: 3000 });
    });

    it('should close modal when cancel is pressed', () => {
      const { getByTestId, queryByTestId } = render(<BentoDesigner />);
      
      // Open modal
      fireEvent.press(getByTestId('action-add-ingredient'));
      expect(getByTestId('add-ingredient-modal')).toBeTruthy();
      
      // Cancel
      fireEvent.press(getByTestId('cancel-button'));
      
      // Modal should close
      expect(queryByTestId('add-ingredient-modal')).toBeNull();
    });

    it('should load user ingredients on mount', async () => {
      const mockUserIngredients = [{
        id: 'user-ingredient-existing',
        name: '既存のユーザー食材',
        category: 'side',
        color: 'yellow',
        nutrition: { vitamin: 60, protein: 40, fiber: 30 },
        cookingTime: 8,
        cost: 120,
        season: 'all',
        isFrozen: false,
        isReadyToEat: true,
        defaultSize: { width: 40, height: 30 },
        icon: 'circle',
      }];

      (IngredientService.loadUserIngredients as jest.Mock).mockResolvedValue(undefined);
      (IngredientService.getAllWithUserIngredients as jest.Mock).mockResolvedValue([
        ...mockInitialIngredients,
        ...mockUserIngredients,
      ]);

      const { getByTestId } = render(<BentoDesigner />);
      
      await waitFor(() => {
        expect(IngredientService.loadUserIngredients).toHaveBeenCalled();
        expect(getByTestId('ingredient-item-user-ingredient-existing')).toBeTruthy();
      }, { timeout: 3000 });
    });
  });
});