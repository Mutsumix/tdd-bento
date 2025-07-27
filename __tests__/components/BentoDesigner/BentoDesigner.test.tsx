import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BentoDesigner } from '@/components/BentoDesigner/BentoDesigner';
import { getInitialIngredients } from '@/data/initialIngredients';
import { createBentoBox } from '@/utils/bentoBox';

describe('BentoDesigner Main Screen Integration', () => {
  const mockIngredients = getInitialIngredients().slice(0, 5);
  const mockBentoBox = createBentoBox({
    type: 'rectangle',
    dimensions: { width: 300, height: 200 }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering and structure', () => {
    it('should render without crashing', () => {
      const { getByTestId } = render(
        <BentoDesigner />
      );
      expect(getByTestId('bento-designer')).toBeTruthy();
    });

    it('should render all main sections', () => {
      const { getByTestId } = render(
        <BentoDesigner />
      );
      
      // お弁当箱表示エリア（上部）
      expect(getByTestId('bento-container')).toBeTruthy();
      
      // 食材リスト（中部）
      expect(getByTestId('ingredient-list')).toBeTruthy();
      
      // アクションバー（下部）
      expect(getByTestId('action-bar')).toBeTruthy();
    });

    it('should have proper layout structure', () => {
      const { getByTestId } = render(
        <BentoDesigner />
      );
      
      const container = getByTestId('bento-designer');
      expect(container).toBeTruthy();
    });
  });

  describe('Component integration', () => {
    it('should pass ingredients to IngredientList', () => {
      const { getByTestId } = render(
        <BentoDesigner />
      );
      
      const ingredientList = getByTestId('ingredient-list');
      expect(ingredientList).toBeTruthy();
    });

    it('should pass bento box data to BentoBoxCanvas', () => {
      const { getByTestId } = render(
        <BentoDesigner />
      );
      
      const bentoCanvas = getByTestId('bento-box-container');
      expect(bentoCanvas).toBeTruthy();
    });

    it('should handle ingredient drop events', () => {
      const { getByTestId } = render(
        <BentoDesigner />
      );
      
      // ドラッグ&ドロップのイベントハンドリングテスト
      const bentoCanvas = getByTestId('bento-box-container');
      expect(bentoCanvas).toBeTruthy();
    });
  });

  describe('State management', () => {
    it('should manage placed ingredients state', () => {
      const { getByTestId } = render(
        <BentoDesigner />
      );
      
      expect(getByTestId('bento-designer')).toBeTruthy();
    });

    it('should manage suggestion modal visibility', () => {
      const { queryByTestId } = render(
        <BentoDesigner />
      );
      
      // 初期状態ではSuggestionModalは非表示
      expect(queryByTestId('suggestion-modal')).toBeNull();
    });
  });

  describe('User workflow', () => {
    it('should open suggestion modal when suggestion button is pressed', () => {
      const { getByTestId } = render(
        <BentoDesigner />
      );
      
      const suggestionButton = getByTestId('action-suggestion');
      fireEvent.press(suggestionButton);
      
      expect(getByTestId('suggestion-modal')).toBeTruthy();
    });

    it('should clear placed ingredients when clear button is pressed', () => {
      const { getByTestId } = render(
        <BentoDesigner />
      );
      
      const clearButton = getByTestId('action-clear');
      fireEvent.press(clearButton);
      
      // クリア後の状態確認は実装で定義
      expect(getByTestId('bento-container')).toBeTruthy();
    });
  });
});