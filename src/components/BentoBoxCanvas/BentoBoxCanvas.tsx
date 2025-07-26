import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { BentoBox, PlacedIngredient } from '@/types';

export interface BentoBoxCanvasProps {
  bentoBox: BentoBox;
  placedIngredients: PlacedIngredient[];
  onIngredientPress?: (ingredient: PlacedIngredient) => void;
}

export function BentoBoxCanvas({ 
  bentoBox, 
  placedIngredients,
  onIngredientPress 
}: BentoBoxCanvasProps) {
  return (
    <View 
      testID="bento-box-container"
      style={[
        styles.container,
        {
          width: bentoBox.dimensions.width,
          height: bentoBox.dimensions.height
        }
      ]}
    >
      {/* Render partitions */}
      {bentoBox.partitions.map((partition) => (
        <View
          key={partition.id}
          testID={`partition-${partition.id}`}
          style={[
            styles.partition,
            {
              position: 'absolute',
              left: partition.bounds.x,
              top: partition.bounds.y,
              width: partition.bounds.width,
              height: partition.bounds.height
            }
          ]}
        />
      ))}

      {/* Render placed ingredients */}
      {placedIngredients.map((placedIngredient) => (
        <TouchableOpacity
          key={placedIngredient.id}
          testID={`placed-ingredient-${placedIngredient.id}`}
          style={[
            styles.placedIngredient,
            {
              position: 'absolute',
              left: placedIngredient.position.x,
              top: placedIngredient.position.y,
              width: placedIngredient.size.width,
              height: placedIngredient.size.height
            }
          ]}
          onPress={() => onIngredientPress?.(placedIngredient)}
          disabled={!onIngredientPress}
        >
          <View style={styles.ingredientContent} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative'
  },
  partition: {
    borderWidth: 1,
    borderColor: '#999',
    borderStyle: 'dashed'
  },
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