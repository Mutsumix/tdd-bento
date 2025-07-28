import { useState, useCallback } from 'react';

/**
 * Hook for managing error state
 * Provides error message state and functions to set/clear errors
 */
export function useErrorState() {
  const [error, setErrorState] = useState<string | null>(null);

  /**
   * Set error message
   * @param errorMessage The error message to display
   */
  const setError = useCallback((errorMessage: string | null) => {
    setErrorState(errorMessage);
  }, []);

  /**
   * Clear current error message
   */
  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  /**
   * Check if there is an active error
   */
  const hasError = error !== null;

  return {
    error,
    setError,
    clearError,
    hasError
  };
}