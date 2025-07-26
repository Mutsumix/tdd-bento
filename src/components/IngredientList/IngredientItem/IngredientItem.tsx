import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ingredient } from '@/types';

export interface IngredientItemProps {
  ingredient: Ingredient;
  onPress?: (ingredient: Ingredient) => void;
}

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
    width: 80,
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 4,
    overflow: 'hidden'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4
  },
  name: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333'
  },
  category: {
    fontSize: 10,
    color: '#666',
    marginTop: 2
  }
});