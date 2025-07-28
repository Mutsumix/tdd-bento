import { ERROR_MESSAGES, getErrorMessage } from '@/constants/errorMessages';

describe('Error Messages', () => {
  describe('ERROR_MESSAGES constant', () => {
    it('should contain all required error message keys', () => {
      expect(ERROR_MESSAGES.INGREDIENT_SAVE_FAILED).toBeDefined();
      expect(ERROR_MESSAGES.SUGGESTION_ADOPT_FAILED).toBeDefined();
      expect(ERROR_MESSAGES.STORAGE_LOAD_FAILED).toBeDefined();
      expect(ERROR_MESSAGES.CLEAR_FAILED).toBeDefined();
      expect(ERROR_MESSAGES.PLACEMENT_FAILED).toBeDefined();
      expect(ERROR_MESSAGES.UNKNOWN_ERROR).toBeDefined();
    });

    it('should have Japanese error messages', () => {
      expect(ERROR_MESSAGES.INGREDIENT_SAVE_FAILED).toBe('食材の保存に失敗しました。もう一度お試しください。');
      expect(ERROR_MESSAGES.SUGGESTION_ADOPT_FAILED).toBe('提案の採用に失敗しました。もう一度お試しください。');
      expect(ERROR_MESSAGES.STORAGE_LOAD_FAILED).toBe('データの読み込みに失敗しました。アプリを再起動してください。');
      expect(ERROR_MESSAGES.CLEAR_FAILED).toBe('クリア操作に失敗しました。もう一度お試しください。');
      expect(ERROR_MESSAGES.PLACEMENT_FAILED).toBe('食材の配置に失敗しました。もう一度お試しください。');
      expect(ERROR_MESSAGES.UNKNOWN_ERROR).toBe('予期しないエラーが発生しました。');
    });

    it('should not contain empty messages', () => {
      Object.values(ERROR_MESSAGES).forEach(message => {
        expect(message).toBeTruthy();
        expect(typeof message).toBe('string');
        expect(message.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getErrorMessage function', () => {
    it('should return specific error message for known error types', () => {
      expect(getErrorMessage('INGREDIENT_SAVE_FAILED')).toBe(ERROR_MESSAGES.INGREDIENT_SAVE_FAILED);
      expect(getErrorMessage('SUGGESTION_ADOPT_FAILED')).toBe(ERROR_MESSAGES.SUGGESTION_ADOPT_FAILED);
      expect(getErrorMessage('STORAGE_LOAD_FAILED')).toBe(ERROR_MESSAGES.STORAGE_LOAD_FAILED);
      expect(getErrorMessage('CLEAR_FAILED')).toBe(ERROR_MESSAGES.CLEAR_FAILED);
      expect(getErrorMessage('PLACEMENT_FAILED')).toBe(ERROR_MESSAGES.PLACEMENT_FAILED);
    });

    it('should return unknown error message for invalid error types', () => {
      expect(getErrorMessage('INVALID_ERROR_TYPE' as any)).toBe(ERROR_MESSAGES.UNKNOWN_ERROR);
      expect(getErrorMessage('NON_EXISTENT' as any)).toBe(ERROR_MESSAGES.UNKNOWN_ERROR);
      expect(getErrorMessage('' as any)).toBe(ERROR_MESSAGES.UNKNOWN_ERROR);
    });

    it('should handle undefined input', () => {
      expect(getErrorMessage(undefined as any)).toBe(ERROR_MESSAGES.UNKNOWN_ERROR);
    });

    it('should handle null input', () => {
      expect(getErrorMessage(null as any)).toBe(ERROR_MESSAGES.UNKNOWN_ERROR);
    });

    it('should be case sensitive', () => {
      expect(getErrorMessage('ingredient_save_failed' as any)).toBe(ERROR_MESSAGES.UNKNOWN_ERROR);
      expect(getErrorMessage('INGREDIENT_save_FAILED' as any)).toBe(ERROR_MESSAGES.UNKNOWN_ERROR);
    });
  });

  describe('Error message quality', () => {
    it('should have user-friendly Japanese messages', () => {
      Object.values(ERROR_MESSAGES).forEach(message => {
        // Should end with appropriate Japanese punctuation
        expect(message).toMatch(/[。！]$/);
        
        // Should not contain technical terms
        expect(message).not.toMatch(/error|Error|ERROR/);
        expect(message).not.toMatch(/exception|Exception/);
        expect(message).not.toMatch(/null|undefined/);
      });
    });

    it('should provide actionable guidance', () => {
      expect(ERROR_MESSAGES.INGREDIENT_SAVE_FAILED).toContain('もう一度お試しください');
      expect(ERROR_MESSAGES.SUGGESTION_ADOPT_FAILED).toContain('もう一度お試しください');
      expect(ERROR_MESSAGES.STORAGE_LOAD_FAILED).toContain('アプリを再起動してください');
      expect(ERROR_MESSAGES.CLEAR_FAILED).toContain('もう一度お試しください');
      expect(ERROR_MESSAGES.PLACEMENT_FAILED).toContain('もう一度お試しください');
    });
  });
});