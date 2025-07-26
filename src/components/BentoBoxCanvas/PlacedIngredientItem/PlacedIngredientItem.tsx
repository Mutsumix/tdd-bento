import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { PlacedIngredient } from '@/types';
import { IngredientService } from '@/services/ingredientService';
import { getColorCode, DEFAULT_COLOR } from '@/utils/colors';
import { calculateIconSize, calculateFontSize, SIZING_CONFIG } from '@/utils/sizing';

export interface PlacedIngredientItemProps {
  placedIngredient: PlacedIngredient;
  onPress?: (ingredient: PlacedIngredient) => void;
}

export function PlacedIngredientItem({ 
  placedIngredient, 
  onPress 
}: PlacedIngredientItemProps) {
  const ingredient = IngredientService.findById(placedIngredient.ingredientId);
  
  // Calculate dynamic sizes based on container dimensions
  const iconSize = calculateIconSize(placedIngredient.size);
  const fontSize = calculateFontSize(placedIngredient.size);
  
  const dynamicStyle: ViewStyle = {
    position: 'absolute',
    left: placedIngredient.position.x,
    top: placedIngredient.position.y,
    width: placedIngredient.size.width,
    height: placedIngredient.size.height
  };

  const iconStyle: ViewStyle = {
    backgroundColor: ingredient ? getColorCode(ingredient.color) : DEFAULT_COLOR,
    width: iconSize,
    height: iconSize,
    borderRadius: iconSize / 2,
    marginBottom: SIZING_CONFIG.ICON_MARGIN_BOTTOM,
  };

  const textStyle: TextStyle = {
    fontSize,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333'
  };

  const Container = onPress ? TouchableOpacity : View;

  if (!ingredient) {
    return (
      <Container
        testID={`placed-ingredient-${placedIngredient.id}`}
        style={[styles.placedIngredient, dynamicStyle]}
        {...(onPress && { onPress: () => onPress(placedIngredient) })}
      >
        <View style={styles.ingredientContent} />
      </Container>
    );
  }

  return (
    <Container
      testID={`placed-ingredient-${placedIngredient.id}`}
      style={[styles.placedIngredient, dynamicStyle]}
      {...(onPress && { onPress: () => onPress(placedIngredient) })}
    >
      <View style={[styles.ingredientContent, { padding: SIZING_CONFIG.CONTENT_PADDING }]}>
        <View 
          testID={`ingredient-icon-${ingredient.id}`}
          style={iconStyle} 
        />
        <Text 
          testID={`ingredient-name-${ingredient.id}`}
          style={textStyle}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {ingredient.name}
        </Text>
      </View>
    </Container>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});