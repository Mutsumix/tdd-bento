import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ingredient } from '@/types';

export interface IngredientItemProps {
  ingredient: Ingredient;
  onPress?: (ingredient: Ingredient) => void;
}

// Constants for styling consistency
const ITEM_DIMENSIONS = {
  WIDTH: 80,
  HEIGHT: 80,
} as const;

const SPACING = {
  BORDER_RADIUS: 8,
  BORDER_WIDTH: 1,
  MARGIN_HORIZONTAL: 4,
  CONTENT_PADDING: 4,
  TEXT_SPACING: 2,
} as const;

const FONT_SIZES = {
  NAME: 12,
  CATEGORY: 10,
} as const;

const COLORS = {
  BACKGROUND: '#f0f0f0',
  BORDER: '#ddd',
  TEXT_PRIMARY: '#333',
  TEXT_SECONDARY: '#666',
} as const;

export function IngredientItem({ ingredient, onPress }: IngredientItemProps) {
  return (
    <TouchableOpacity
      testID={`ingredient-item-${ingredient.id}`}
      style={styles.container}
      onPress={() => onPress?.(ingredient)}
      disabled={!onPress}
    >
      <View style={styles.content}>
        <Text style={styles.name}>{ingredient.name}</Text>
        <Text style={styles.category}>{ingredient.category}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: ITEM_DIMENSIONS.WIDTH,
    height: ITEM_DIMENSIONS.HEIGHT,
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: SPACING.BORDER_RADIUS,
    borderWidth: SPACING.BORDER_WIDTH,
    borderColor: COLORS.BORDER,
    marginHorizontal: SPACING.MARGIN_HORIZONTAL,
    overflow: 'hidden'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.CONTENT_PADDING
  },
  name: {
    fontSize: FONT_SIZES.NAME,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.TEXT_PRIMARY
  },
  category: {
    fontSize: FONT_SIZES.CATEGORY,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.TEXT_SPACING
  }
});