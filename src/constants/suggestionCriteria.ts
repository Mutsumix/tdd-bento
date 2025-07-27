import { SuggestionType } from '@/services/suggestionService';

/**
 * Suggestion criteria configuration for the SuggestionModal
 * Centralizes the criteria types and their Japanese labels
 */
export const SUGGESTION_CRITERIA: Array<{ type: SuggestionType; label: string }> = [
  { type: 'speed', label: '速さ重視' },
  { type: 'nutrition', label: '栄養バランス' },
  { type: 'color', label: 'いろどり' },
  { type: 'season', label: '季節感' },
  { type: 'cost', label: 'コスト重視' }
] as const;