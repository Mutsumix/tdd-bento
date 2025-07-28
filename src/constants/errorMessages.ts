/**
 * User-friendly error messages in Japanese
 * These messages are displayed to users when errors occur
 */
export const ERROR_MESSAGES = {
  INGREDIENT_SAVE_FAILED: '食材の保存に失敗しました。もう一度お試しください。',
  SUGGESTION_ADOPT_FAILED: '提案の採用に失敗しました。もう一度お試しください。',
  STORAGE_LOAD_FAILED: 'データの読み込みに失敗しました。アプリを再起動してください。',
  CLEAR_FAILED: 'クリア操作に失敗しました。もう一度お試しください。',
  PLACEMENT_FAILED: '食材の配置に失敗しました。もう一度お試しください。',
  UNKNOWN_ERROR: '予期しないエラーが発生しました。'
} as const;

/**
 * Type for error message keys
 */
export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;

/**
 * Get user-friendly error message by error type
 * @param errorType The type of error that occurred
 * @returns User-friendly error message in Japanese
 */
export function getErrorMessage(errorType: ErrorMessageKey | string): string {
  if (errorType in ERROR_MESSAGES) {
    return ERROR_MESSAGES[errorType as ErrorMessageKey];
  }
  return ERROR_MESSAGES.UNKNOWN_ERROR;
}

/**
 * Check if an error type is valid
 * @param errorType The error type to check
 * @returns True if the error type is valid
 */
export function isValidErrorType(errorType: string): errorType is ErrorMessageKey {
  return errorType in ERROR_MESSAGES;
}