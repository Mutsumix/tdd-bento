import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Ingredient } from '@/types';
import { IngredientItem, DragPosition } from './IngredientItem/IngredientItem';

export interface IngredientListProps {
  ingredients: Ingredient[];
  onIngredientPress?: (ingredient: Ingredient) => void;
  onDragStart?: (ingredient: Ingredient) => void;
  onDragEnd?: (ingredient: Ingredient, position: DragPosition) => void;
  // Note: Category filtering will be added in future iterations
  // selectedCategory?: string;
  // onCategoryChange?: (category: string) => void;
}

export function IngredientList({ 
  ingredients,
  onIngredientPress,
  onDragStart,
  onDragEnd
}: IngredientListProps) {
  return (
    <ScrollView
      testID="ingredient-list"
      horizontal={true}
      showsHorizontalScrollIndicator={true}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {ingredients.map((ingredient) => (
        <IngredientItem
          key={ingredient.id}
          ingredient={ingredient}
          onPress={onIngredientPress}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 8
  }
});