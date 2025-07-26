import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { PlacedIngredient } from '@/types';

export interface PlacedIngredientItemProps {
  placedIngredient: PlacedIngredient;
  onPress?: (ingredient: PlacedIngredient) => void;
}

export function PlacedIngredientItem({ 
  placedIngredient, 
  onPress 
}: PlacedIngredientItemProps) {
  const dynamicStyle: ViewStyle = {
    position: 'absolute',
    left: placedIngredient.position.x,
    top: placedIngredient.position.y,
    width: placedIngredient.size.width,
    height: placedIngredient.size.height
  };

  return (
    <TouchableOpacity
      testID={`placed-ingredient-${placedIngredient.id}`}
      style={[styles.placedIngredient, dynamicStyle]}
      onPress={() => onPress?.(placedIngredient)}
      disabled={!onPress}
    >
      <View style={styles.ingredientContent} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  placedIngredient: {
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#666'
  },
  ingredientContent: {
    flex: 1
  }
});