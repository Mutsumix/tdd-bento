import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { UI_COLORS } from '@/utils/colors';
import { ACTION_BAR_CONFIG } from '@/constants/actionBar';

export interface ActionBarProps {
  onSuggestion: () => void;
  onClear: () => void;
  hasPlacedIngredients?: boolean;
}

export function ActionBar({ 
  onSuggestion, 
  onClear, 
  hasPlacedIngredients = false 
}: ActionBarProps) {
  return (
    <View style={styles.container} testID="action-bar">
      <TouchableOpacity
        style={[
          styles.button,
          styles.suggestionButton,
          !hasPlacedIngredients && styles.disabledButton
        ]}
        onPress={onSuggestion}
        testID="action-suggestion"
        disabled={!hasPlacedIngredients}
        accessibilityState={{ disabled: !hasPlacedIngredients }}
      >
        <Text style={[styles.buttonText, !hasPlacedIngredients && styles.disabledText]}>
          {ACTION_BAR_CONFIG.BUTTON_TEXT.SUGGESTION}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          styles.clearButton,
          !hasPlacedIngredients && styles.disabledButton
        ]}
        onPress={onClear}
        testID="action-clear"
        disabled={!hasPlacedIngredients}
        accessibilityState={{ disabled: !hasPlacedIngredients }}
      >
        <Text style={[styles.buttonText, !hasPlacedIngredients && styles.disabledText]}>
          {ACTION_BAR_CONFIG.BUTTON_TEXT.CLEAR}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: ACTION_BAR_CONFIG.LAYOUT.PADDING_HORIZONTAL,
    paddingVertical: ACTION_BAR_CONFIG.LAYOUT.PADDING_VERTICAL,
    backgroundColor: UI_COLORS.background.modal,
    borderTopWidth: ACTION_BAR_CONFIG.LAYOUT.BORDER_WIDTH,
    borderTopColor: UI_COLORS.border.light,
  },
  button: {
    flex: 1,
    paddingVertical: ACTION_BAR_CONFIG.BUTTON.PADDING_VERTICAL,
    marginHorizontal: ACTION_BAR_CONFIG.BUTTON.MARGIN_HORIZONTAL,
    borderRadius: ACTION_BAR_CONFIG.BUTTON.BORDER_RADIUS,
    alignItems: 'center',
  },
  suggestionButton: {
    backgroundColor: UI_COLORS.primary,
  },
  clearButton: {
    backgroundColor: UI_COLORS.destructive,
  },
  disabledButton: {
    backgroundColor: UI_COLORS.border.light,
  },
  buttonText: {
    color: UI_COLORS.background.modal,
    fontSize: ACTION_BAR_CONFIG.TEXT.FONT_SIZE,
    fontWeight: ACTION_BAR_CONFIG.TEXT.FONT_WEIGHT,
  },
  disabledText: {
    color: UI_COLORS.text.muted,
  },
});