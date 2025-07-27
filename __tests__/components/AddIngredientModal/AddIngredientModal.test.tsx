import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AddIngredientModal } from '@/components/AddIngredientModal/AddIngredientModal';
import { Ingredient } from '@/types';

describe('AddIngredientModal', () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render without crashing when visible', () => {
      const { getByTestId } = render(
        <AddIngredientModal
          visible={true}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );
      expect(getByTestId('add-ingredient-modal')).toBeTruthy();
    });

    it('should not render when not visible', () => {
      const { queryByTestId } = render(
        <AddIngredientModal
          visible={false}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );
      expect(queryByTestId('add-ingredient-modal')).toBeNull();
    });

    it('should render all form sections', () => {
      const { getByTestId } = render(
        <AddIngredientModal
          visible={true}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );
      
      // Basic info section
      expect(getByTestId('basic-info-section')).toBeTruthy();
      
      // Nutrition section
      expect(getByTestId('nutrition-section')).toBeTruthy();
      
      // Additional info section
      expect(getByTestId('additional-info-section')).toBeTruthy();
      
      // Action buttons
      expect(getByTestId('action-buttons-section')).toBeTruthy();
    });
  });

  describe('Form inputs', () => {
    it('should render name input field', () => {
      const { getByTestId } = render(
        <AddIngredientModal
          visible={true}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );
      expect(getByTestId('name-input')).toBeTruthy();
    });

    it('should render category selector', () => {
      const { getByTestId } = render(
        <AddIngredientModal
          visible={true}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );
      expect(getByTestId('category-selector')).toBeTruthy();
    });

    it('should render color selector', () => {
      const { getByTestId } = render(
        <AddIngredientModal
          visible={true}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );
      expect(getByTestId('color-selector')).toBeTruthy();
    });

    it('should render nutrition inputs', () => {
      const { getByTestId } = render(
        <AddIngredientModal
          visible={true}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );
      
      expect(getByTestId('vitamin-input')).toBeTruthy();
      expect(getByTestId('protein-input')).toBeTruthy();
      expect(getByTestId('fiber-input')).toBeTruthy();
    });

    it('should render cost and cooking time inputs', () => {
      const { getByTestId } = render(
        <AddIngredientModal
          visible={true}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );
      
      expect(getByTestId('cost-input')).toBeTruthy();
      expect(getByTestId('cooking-time-input')).toBeTruthy();
    });
  });

  describe('Action buttons', () => {
    it('should render save and cancel buttons', () => {
      const { getByTestId } = render(
        <AddIngredientModal
          visible={true}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );
      
      expect(getByTestId('save-button')).toBeTruthy();
      expect(getByTestId('cancel-button')).toBeTruthy();
    });

    it('should call onCancel when cancel button is pressed', () => {
      const { getByTestId } = render(
        <AddIngredientModal
          visible={true}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );
      
      const cancelButton = getByTestId('cancel-button');
      fireEvent.press(cancelButton);
      
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('should call onSave with ingredient data when save button is pressed', () => {
      const { getByTestId } = render(
        <AddIngredientModal
          visible={true}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );
      
      // Fill form fields (this will test actual input functionality later)
      const nameInput = getByTestId('name-input');
      fireEvent.changeText(nameInput, 'テスト食材');
      
      const saveButton = getByTestId('save-button');
      fireEvent.press(saveButton);
      
      expect(mockOnSave).toHaveBeenCalledTimes(1);
      // More specific assertions will be added after implementation
    });
  });

  describe('Form validation', () => {
    it('should disable save button when name is empty', () => {
      const { getByTestId } = render(
        <AddIngredientModal
          visible={true}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );
      
      const saveButton = getByTestId('save-button');
      expect(saveButton.props.accessibilityState?.disabled).toBe(true);
    });

    it('should enable save button when all required fields are filled', () => {
      const { getByTestId } = render(
        <AddIngredientModal
          visible={true}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );
      
      // Fill required fields
      const nameInput = getByTestId('name-input');
      fireEvent.changeText(nameInput, '有効な食材名');
      
      const saveButton = getByTestId('save-button');
      expect(saveButton.props.accessibilityState?.disabled).toBe(false);
    });
  });
});