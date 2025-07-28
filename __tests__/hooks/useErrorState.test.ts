import { renderHook, act } from '@testing-library/react-native';
import { useErrorState } from '@/hooks/useErrorState';

describe('useErrorState', () => {
  it('should initialize with no error', () => {
    const { result } = renderHook(() => useErrorState());
    
    expect(result.current.error).toBeNull();
    expect(typeof result.current.setError).toBe('function');
    expect(typeof result.current.clearError).toBe('function');
  });

  it('should set error message', () => {
    const { result } = renderHook(() => useErrorState());
    const errorMessage = '食材の追加に失敗しました';
    
    act(() => {
      result.current.setError(errorMessage);
    });
    
    expect(result.current.error).toBe(errorMessage);
  });

  it('should clear error message', () => {
    const { result } = renderHook(() => useErrorState());
    
    act(() => {
      result.current.setError('テストエラー');
    });
    
    expect(result.current.error).toBe('テストエラー');
    
    act(() => {
      result.current.clearError();
    });
    
    expect(result.current.error).toBeNull();
  });

  it('should overwrite existing error with new error', () => {
    const { result } = renderHook(() => useErrorState());
    
    act(() => {
      result.current.setError('最初のエラー');
    });
    
    expect(result.current.error).toBe('最初のエラー');
    
    act(() => {
      result.current.setError('新しいエラー');
    });
    
    expect(result.current.error).toBe('新しいエラー');
  });

  it('should handle setting error to empty string', () => {
    const { result } = renderHook(() => useErrorState());
    
    act(() => {
      result.current.setError('');
    });
    
    expect(result.current.error).toBe('');
  });

  it('should handle setting error to null', () => {
    const { result } = renderHook(() => useErrorState());
    
    act(() => {
      result.current.setError('テストエラー');
    });
    
    expect(result.current.error).toBe('テストエラー');
    
    act(() => {
      result.current.setError(null);
    });
    
    expect(result.current.error).toBeNull();
  });
});