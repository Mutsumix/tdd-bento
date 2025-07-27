import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ActionBar } from '@/components/ActionBar/ActionBar';

describe('ActionBar Component', () => {
  const mockOnSuggestion = jest.fn();
  const mockOnClear = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render without crashing', () => {
      const { getByTestId } = render(
        <ActionBar 
          onSuggestion={mockOnSuggestion}
          onClear={mockOnClear}
        />
      );
      expect(getByTestId('action-bar')).toBeTruthy();
    });

    it('should render all action buttons', () => {
      const { getByTestId } = render(
        <ActionBar 
          onSuggestion={mockOnSuggestion}
          onClear={mockOnClear}
        />
      );
      
      // 提案を受けるボタン
      expect(getByTestId('action-suggestion')).toBeTruthy();
      
      // クリアボタン
      expect(getByTestId('action-clear')).toBeTruthy();
    });

    it('should have proper button layout', () => {
      const { getByTestId } = render(
        <ActionBar 
          onSuggestion={mockOnSuggestion}
          onClear={mockOnClear}
        />
      );
      
      const actionBar = getByTestId('action-bar');
      expect(actionBar).toBeTruthy();
    });
  });

  describe('User interaction', () => {
    it('should call onSuggestion when suggestion button is pressed', () => {
      const { getByTestId } = render(
        <ActionBar 
          onSuggestion={mockOnSuggestion}
          onClear={mockOnClear}
        />
      );
      
      const suggestionButton = getByTestId('action-suggestion');
      fireEvent.press(suggestionButton);
      
      expect(mockOnSuggestion).toHaveBeenCalledTimes(1);
    });

    it('should call onClear when clear button is pressed', () => {
      const { getByTestId } = render(
        <ActionBar 
          onSuggestion={mockOnSuggestion}
          onClear={mockOnClear}
        />
      );
      
      const clearButton = getByTestId('action-clear');
      fireEvent.press(clearButton);
      
      expect(mockOnClear).toHaveBeenCalledTimes(1);
    });
  });

  describe('Button states', () => {
    it('should disable suggestion button when no ingredients are placed', () => {
      const { getByTestId } = render(
        <ActionBar 
          onSuggestion={mockOnSuggestion}
          onClear={mockOnClear}
          hasPlacedIngredients={false}
        />
      );
      
      const suggestionButton = getByTestId('action-suggestion');
      expect(suggestionButton.props.accessibilityState?.disabled).toBe(true);
    });

    it('should enable suggestion button when ingredients are placed', () => {
      const { getByTestId } = render(
        <ActionBar 
          onSuggestion={mockOnSuggestion}
          onClear={mockOnClear}
          hasPlacedIngredients={true}
        />
      );
      
      const suggestionButton = getByTestId('action-suggestion');
      expect(suggestionButton.props.accessibilityState?.disabled).toBe(false);
    });

    it('should disable clear button when no ingredients are placed', () => {
      const { getByTestId } = render(
        <ActionBar 
          onSuggestion={mockOnSuggestion}
          onClear={mockOnClear}
          hasPlacedIngredients={false}
        />
      );
      
      const clearButton = getByTestId('action-clear');
      expect(clearButton.props.accessibilityState?.disabled).toBe(true);
    });
  });

  describe('Button styling', () => {
    it('should have appropriate button text', () => {
      const { getByTestId } = render(
        <ActionBar 
          onSuggestion={mockOnSuggestion}
          onClear={mockOnClear}
        />
      );
      
      const suggestionButton = getByTestId('action-suggestion');
      const clearButton = getByTestId('action-clear');
      
      expect(suggestionButton).toBeTruthy();
      expect(clearButton).toBeTruthy();
    });
  });
});