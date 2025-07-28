import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ErrorMessage } from '@/components/ErrorMessage';

describe('ErrorMessage', () => {
  it('should not render when no error is present', () => {
    const { queryByTestId } = render(
      <ErrorMessage error={null} onDismiss={() => {}} />
    );
    
    expect(queryByTestId('error-message')).toBeNull();
  });

  it('should render error message when error is present', () => {
    const errorMessage = '食材の保存に失敗しました';
    const { getByTestId } = render(
      <ErrorMessage error={errorMessage} onDismiss={() => {}} />
    );
    
    expect(getByTestId('error-message')).toBeTruthy();
    expect(getByTestId('error-message-text')).toBeTruthy();
    expect(getByTestId('error-message-text').props.children).toBe(errorMessage);
  });

  it('should display close button', () => {
    const errorMessage = 'テストエラー';
    const { getByTestId } = render(
      <ErrorMessage error={errorMessage} onDismiss={() => {}} />
    );
    
    expect(getByTestId('error-message-close')).toBeTruthy();
  });

  it('should call onDismiss when close button is pressed', () => {
    const onDismiss = jest.fn();
    const errorMessage = 'テストエラー';
    const { getByTestId } = render(
      <ErrorMessage error={errorMessage} onDismiss={onDismiss} />
    );
    
    fireEvent.press(getByTestId('error-message-close'));
    
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('should auto-dismiss after specified duration', async () => {
    const onDismiss = jest.fn();
    const errorMessage = 'テストエラー';
    const autoDismissMs = 1000;
    
    render(
      <ErrorMessage 
        error={errorMessage} 
        onDismiss={onDismiss}
        autoDismissMs={autoDismissMs}
      />
    );
    
    await waitFor(() => {
      expect(onDismiss).toHaveBeenCalledTimes(1);
    }, { timeout: autoDismissMs + 100 });
  });

  it('should not auto-dismiss when autoDismissMs is not provided', async () => {
    const onDismiss = jest.fn();
    const errorMessage = 'テストエラー';
    
    render(
      <ErrorMessage error={errorMessage} onDismiss={onDismiss} />
    );
    
    // Wait for a reasonable time to ensure auto-dismiss doesn't happen
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('should clear auto-dismiss timer when component unmounts', () => {
    const onDismiss = jest.fn();
    const errorMessage = 'テストエラー';
    
    const { unmount } = render(
      <ErrorMessage 
        error={errorMessage} 
        onDismiss={onDismiss}
        autoDismissMs={1000}
      />
    );
    
    // Unmount before auto-dismiss should trigger
    unmount();
    
    // Wait to ensure onDismiss is not called after unmount
    setTimeout(() => {
      expect(onDismiss).not.toHaveBeenCalled();
    }, 1100);
  });

  it('should have appropriate error styling', () => {
    const errorMessage = 'スタイルテスト';
    const { getByTestId } = render(
      <ErrorMessage error={errorMessage} onDismiss={() => {}} />
    );
    
    const errorComponent = getByTestId('error-message');
    expect(errorComponent.props.style).toBeTruthy();
  });

  it('should support custom testID', () => {
    const errorMessage = 'カスタムテストID';
    const customTestID = 'custom-error';
    const { getByTestId, queryByTestId } = render(
      <ErrorMessage 
        error={errorMessage} 
        onDismiss={() => {}} 
        testID={customTestID}
      />
    );
    
    expect(getByTestId(customTestID)).toBeTruthy();
    expect(getByTestId(`${customTestID}-text`)).toBeTruthy();
    expect(getByTestId(`${customTestID}-close`)).toBeTruthy();
    expect(queryByTestId('error-message')).toBeNull();
  });

  it('should render at bottom position when specified', () => {
    const errorMessage = 'ボトムポジション';
    const { getByTestId } = render(
      <ErrorMessage 
        error={errorMessage} 
        onDismiss={() => {}} 
        position="bottom"
      />
    );
    
    const errorComponent = getByTestId('error-message');
    expect(errorComponent.props.style).toEqual(
      expect.objectContaining({
        bottom: 50
      })
    );
  });

  it('should render at top position by default', () => {
    const errorMessage = 'トップポジション';
    const { getByTestId } = render(
      <ErrorMessage error={errorMessage} onDismiss={() => {}} />
    );
    
    const errorComponent = getByTestId('error-message');
    expect(errorComponent.props.style).toEqual(
      expect.objectContaining({
        top: 50
      })
    );
  });

  it('should have proper accessibility attributes', () => {
    const errorMessage = 'アクセシビリティテスト';
    const { getByTestId } = render(
      <ErrorMessage error={errorMessage} onDismiss={() => {}} />
    );
    
    const closeButton = getByTestId('error-message-close');
    
    expect(closeButton.props.accessibilityRole).toBe('button');
    expect(closeButton.props.accessibilityLabel).toBe('エラーメッセージを閉じる');
  });
});