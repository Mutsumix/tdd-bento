import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BentoBox, PlacedIngredient } from '@/types';
import { PartitionArea } from './PartitionArea';
import { PlacedIngredientItem } from './PlacedIngredientItem';

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
  const containerStyle: ViewStyle = {
    width: bentoBox.dimensions.width,
    height: bentoBox.dimensions.height
  };

  return (
    <View 
      testID="bento-box-container"
      style={[styles.container, containerStyle]}
    >
      {/* Render partitions */}
      {bentoBox.partitions.map((partition) => (
        <PartitionArea
          key={partition.id}
          partition={partition}
        />
      ))}

      {/* Render placed ingredients */}
      {placedIngredients.map((placedIngredient) => (
        <PlacedIngredientItem
          key={placedIngredient.id}
          placedIngredient={placedIngredient}
          onPress={onIngredientPress}
        />
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
  }
});