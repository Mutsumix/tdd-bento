import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ingredient } from '@/types';
import { SuggestionService, SuggestionType, SuggestionResult } from '@/services/suggestionService';

export interface SuggestionModalProps {
  visible: boolean;
  ingredients: Ingredient[];
  onAdopt: (suggestion: SuggestionResult) => void;
  onNext: () => void;
  onCancel: () => void;
}

export function SuggestionModal({
  visible,
  ingredients,
  onAdopt,
  onNext,
  onCancel
}: SuggestionModalProps) {
  const [selectedCriteria, setSelectedCriteria] = useState<SuggestionType>('speed');
  const [suggestions, setSuggestions] = useState<SuggestionResult[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const criteria: Array<{ type: SuggestionType; label: string }> = [
    { type: 'speed', label: '速さ重視' },
    { type: 'nutrition', label: '栄養バランス' },
    { type: 'color', label: 'いろどり' },
    { type: 'season', label: '季節感' },
    { type: 'cost', label: 'コスト重視' }
  ];

  // Update suggestions when criteria or ingredients change
  useEffect(() => {
    if (ingredients.length > 0) {
      const newSuggestions = SuggestionService.getSuggestionsWithScores(ingredients, selectedCriteria);
      setSuggestions(newSuggestions);
      setCurrentIndex(0); // Reset to first suggestion
    }
  }, [selectedCriteria, ingredients]);

  const handleCriteriaSelect = (criteriaType: SuggestionType) => {
    setSelectedCriteria(criteriaType);
  };

  const handleNext = () => {
    if (suggestions.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % suggestions.length);
    }
    onNext();
  };

  const handleAdopt = () => {
    if (suggestions.length > 0 && suggestions[currentIndex]) {
      onAdopt(suggestions[currentIndex]);
    }
  };

  const currentSuggestion = suggestions[currentIndex];

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
        <View style={styles.modal} testID="suggestion-modal">
          {/* Criteria Selector */}
          <View style={styles.criteriaContainer}>
            <Text style={styles.criteriaTitle}>評価軸を選択</Text>
            <View style={styles.criteriaButtons}>
              {criteria.map((criterion) => (
                <TouchableOpacity
                  key={criterion.type}
                  style={[
                    styles.criteriaButton,
                    selectedCriteria === criterion.type && styles.criteriaButtonSelected
                  ]}
                  onPress={() => handleCriteriaSelect(criterion.type)}
                  testID={`criteria-${criterion.type}`}
                  accessibilityState={{
                    selected: selectedCriteria === criterion.type
                  }}
                >
                  <Text style={[
                    styles.criteriaButtonText,
                    selectedCriteria === criterion.type && styles.criteriaButtonTextSelected
                  ]}>
                    {criterion.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Suggestion Display */}
          <View style={styles.suggestionContainer} testID="suggestion-display">
            <Text style={styles.suggestionTitle}>おすすめ食材</Text>
            {currentSuggestion ? (
              <View style={styles.suggestionContent}>
                <Text style={styles.ingredientName} testID="suggestion-ingredient-name">
                  {currentSuggestion.ingredient.name}
                </Text>
                <Text style={styles.score} testID="suggestion-score">
                  スコア: {Math.round(currentSuggestion.score)}点
                </Text>
                <Text style={styles.reason} testID="suggestion-reason">
                  {currentSuggestion.reason}
                </Text>
              </View>
            ) : (
              <Text style={styles.noSuggestion}>提案できる食材がありません</Text>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.adoptButton]}
              onPress={handleAdopt}
              testID="action-adopt"
              disabled={!currentSuggestion}
            >
              <Text style={styles.adoptButtonText}>採用</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.nextButton]}
              onPress={handleNext}
              testID="action-next"
              disabled={suggestions.length <= 1}
            >
              <Text style={styles.nextButtonText}>次の提案</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={onCancel}
              testID="action-cancel"
            >
              <Text style={styles.cancelButtonText}>キャンセル</Text>
            </TouchableOpacity>
          </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  criteriaContainer: {
    marginBottom: 24,
  },
  criteriaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  criteriaButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  criteriaButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  criteriaButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  criteriaButtonText: {
    fontSize: 14,
    color: '#333',
  },
  criteriaButtonTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  suggestionContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  suggestionContent: {
    alignItems: 'center',
  },
  ingredientName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  score: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 8,
  },
  reason: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  noSuggestion: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    padding: 20,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  adoptButton: {
    backgroundColor: '#34C759',
  },
  nextButton: {
    backgroundColor: '#007AFF',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  adoptButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  nextButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});