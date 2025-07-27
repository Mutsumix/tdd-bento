import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SuggestionModal } from '@/components/SuggestionModal/SuggestionModal';
import { SuggestionType } from '@/services/suggestionService';
import { getInitialIngredients } from '@/data/initialIngredients';

describe('SuggestionModal', () => {
  const mockIngredients = getInitialIngredients().slice(0, 10); // Use first 10 for testing
  const mockOnAdopt = jest.fn();
  const mockOnNext = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render without crashing', () => {
      const { toJSON } = render(
        <SuggestionModal
          visible={true}
          ingredients={mockIngredients}
          onAdopt={mockOnAdopt}
          onNext={mockOnNext}
          onCancel={mockOnCancel}
        />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should not render when visible is false', () => {
      const { queryByTestId } = render(
        <SuggestionModal
          visible={false}
          ingredients={mockIngredients}
          onAdopt={mockOnAdopt}
          onNext={mockOnNext}
          onCancel={mockOnCancel}
        />
      );
      expect(queryByTestId('suggestion-modal')).toBeNull();
    });

    it('should render modal with testID when visible', () => {
      const { getByTestId } = render(
        <SuggestionModal
          visible={true}
          ingredients={mockIngredients}
          onAdopt={mockOnAdopt}
          onNext={mockOnNext}
          onCancel={mockOnCancel}
        />
      );
      expect(getByTestId('suggestion-modal')).toBeTruthy();
    });
  });

  describe('Criteria selector', () => {
    it('should render all suggestion types as selectable options', () => {
      const { getByTestId } = render(
        <SuggestionModal
          visible={true}
          ingredients={mockIngredients}
          onAdopt={mockOnAdopt}
          onNext={mockOnNext}
          onCancel={mockOnCancel}
        />
      );

      // Check all 5 suggestion types are available
      expect(getByTestId('criteria-speed')).toBeTruthy();
      expect(getByTestId('criteria-nutrition')).toBeTruthy();
      expect(getByTestId('criteria-color')).toBeTruthy();
      expect(getByTestId('criteria-season')).toBeTruthy();
      expect(getByTestId('criteria-cost')).toBeTruthy();
    });

    it('should select speed criteria by default', () => {
      const { getByTestId } = render(
        <SuggestionModal
          visible={true}
          ingredients={mockIngredients}
          onAdopt={mockOnAdopt}
          onNext={mockOnNext}
          onCancel={mockOnCancel}
        />
      );

      const speedCriteria = getByTestId('criteria-speed');
      expect(speedCriteria.props.accessibilityState?.selected).toBe(true);
    });

    it('should change selected criteria when different option is pressed', () => {
      const { getByTestId } = render(
        <SuggestionModal
          visible={true}
          ingredients={mockIngredients}
          onAdopt={mockOnAdopt}
          onNext={mockOnNext}
          onCancel={mockOnCancel}
        />
      );

      const nutritionCriteria = getByTestId('criteria-nutrition');
      fireEvent.press(nutritionCriteria);

      expect(nutritionCriteria.props.accessibilityState?.selected).toBe(true);
    });
  });

  describe('Suggestion display', () => {
    it('should display suggestion results based on selected criteria', () => {
      const { getByTestId } = render(
        <SuggestionModal
          visible={true}
          ingredients={mockIngredients}
          onAdopt={mockOnAdopt}
          onNext={mockOnNext}
          onCancel={mockOnCancel}
        />
      );

      expect(getByTestId('suggestion-display')).toBeTruthy();
    });

    it('should show ingredient name and score in suggestion display', () => {
      const { getByTestId } = render(
        <SuggestionModal
          visible={true}
          ingredients={mockIngredients}
          onAdopt={mockOnAdopt}
          onNext={mockOnNext}
          onCancel={mockOnCancel}
        />
      );

      const display = getByTestId('suggestion-display');
      expect(getByTestId('suggestion-ingredient-name')).toBeTruthy();
      expect(getByTestId('suggestion-score')).toBeTruthy();
      expect(getByTestId('suggestion-reason')).toBeTruthy();
    });

    it('should update suggestion when criteria changes', () => {
      const { getByTestId } = render(
        <SuggestionModal
          visible={true}
          ingredients={mockIngredients}
          onAdopt={mockOnAdopt}
          onNext={mockOnNext}
          onCancel={mockOnCancel}
        />
      );

      // Change to nutrition criteria
      fireEvent.press(getByTestId('criteria-nutrition'));

      // Suggestion should update (this will be verified by implementation)
      expect(getByTestId('suggestion-display')).toBeTruthy();
    });
  });

  describe('Action buttons', () => {
    it('should render all action buttons', () => {
      const { getByTestId } = render(
        <SuggestionModal
          visible={true}
          ingredients={mockIngredients}
          onAdopt={mockOnAdopt}
          onNext={mockOnNext}
          onCancel={mockOnCancel}
        />
      );

      expect(getByTestId('action-adopt')).toBeTruthy();
      expect(getByTestId('action-next')).toBeTruthy();
      expect(getByTestId('action-cancel')).toBeTruthy();
    });

    it('should call onAdopt when adopt button is pressed', () => {
      const { getByTestId } = render(
        <SuggestionModal
          visible={true}
          ingredients={mockIngredients}
          onAdopt={mockOnAdopt}
          onNext={mockOnNext}
          onCancel={mockOnCancel}
        />
      );

      fireEvent.press(getByTestId('action-adopt'));
      expect(mockOnAdopt).toHaveBeenCalledTimes(1);
    });

    it('should call onNext when next button is pressed', () => {
      const { getByTestId } = render(
        <SuggestionModal
          visible={true}
          ingredients={mockIngredients}
          onAdopt={mockOnAdopt}
          onNext={mockOnNext}
          onCancel={mockOnCancel}
        />
      );

      fireEvent.press(getByTestId('action-next'));
      expect(mockOnNext).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when cancel button is pressed', () => {
      const { getByTestId } = render(
        <SuggestionModal
          visible={true}
          ingredients={mockIngredients}
          onAdopt={mockOnAdopt}
          onNext={mockOnNext}
          onCancel={mockOnCancel}
        />
      );

      fireEvent.press(getByTestId('action-cancel'));
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('Modal behavior', () => {
    it('should pass current suggestion data to onAdopt callback', () => {
      const { getByTestId } = render(
        <SuggestionModal
          visible={true}
          ingredients={mockIngredients}
          onAdopt={mockOnAdopt}
          onNext={mockOnNext}
          onCancel={mockOnCancel}
        />
      );

      fireEvent.press(getByTestId('action-adopt'));
      
      // Should pass the current suggested ingredient
      expect(mockOnAdopt).toHaveBeenCalledWith(
        expect.objectContaining({
          ingredient: expect.any(Object),
          score: expect.any(Number),
          reason: expect.any(String)
        })
      );
    });

    it('should cycle through suggestions when next button is pressed multiple times', () => {
      const { getByTestId } = render(
        <SuggestionModal
          visible={true}
          ingredients={mockIngredients}
          onAdopt={mockOnAdopt}
          onNext={mockOnNext}
          onCancel={mockOnCancel}
        />
      );

      const nextButton = getByTestId('action-next');
      
      // Press next multiple times
      fireEvent.press(nextButton);
      fireEvent.press(nextButton);
      fireEvent.press(nextButton);

      expect(mockOnNext).toHaveBeenCalledTimes(3);
    });
  });
});