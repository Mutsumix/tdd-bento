import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BentoBox, PlacedIngredient, Ingredient } from '@/types';
import { isOverlapping } from '@/utils/collision';
import { PartitionArea } from './PartitionArea';
import { PlacedIngredientItem } from './PlacedIngredientItem';

/** Information about where an ingredient was dropped */
export interface DropInfo {
  partitionId: string;
  position: { x: number; y: number };
}

/** Props for BentoBoxCanvas component */
export interface BentoBoxCanvasProps {
  /** The bento box configuration (dimensions and partitions) */
  bentoBox: BentoBox;
  /** Currently placed ingredients in the bento box */
  placedIngredients: PlacedIngredient[];
  /** Callback fired when a placed ingredient is pressed */
  onIngredientPress?: (ingredient: PlacedIngredient) => void;
  /** Callback fired when an ingredient is dropped in a valid location */
  onIngredientDrop?: (ingredient: Ingredient, dropInfo: DropInfo) => void;
  /** The ingredient currently being dragged (if any) */
  draggedIngredient?: Ingredient;
  /** Current position of the dragged ingredient */
  dragPosition?: { x: number; y: number };
}

// Utility functions for drag & drop validation

/** 
 * Checks if a position is within the bounds of a partition
 * Uses inclusive bounds checking
 */
const isPositionInPartition = (
  position: { x: number; y: number },
  partition: { bounds: { x: number; y: number; width: number; height: number } }
): boolean => {
  return (
    position.x >= partition.bounds.x &&
    position.x <= partition.bounds.x + partition.bounds.width &&
    position.y >= partition.bounds.y &&
    position.y <= partition.bounds.y + partition.bounds.height
  );
};


/**
 * BentoBoxCanvas - The main canvas for displaying and interacting with a bento box
 * Handles drag & drop logic, collision detection, and ingredient placement
 */
export function BentoBoxCanvas({ 
  bentoBox, 
  placedIngredients,
  onIngredientPress,
  onIngredientDrop,
  draggedIngredient,
  dragPosition
}: BentoBoxCanvasProps) {
  // Dynamic container style based on bento box dimensions
  const containerStyle: ViewStyle = {
    width: bentoBox.dimensions.width,
    height: bentoBox.dimensions.height
  };

  /**
   * Handles ingredient drop logic with comprehensive validation
   * - Checks if position is within a valid partition
   * - Validates no overlap with existing ingredients
   * - Ensures ingredient fits within partition bounds
   */
  const handleDrop = (position: { x: number; y: number }) => {
    if (!draggedIngredient || !onIngredientDrop) return;

    // Find which partition the drop position is in
    const targetPartition = bentoBox.partitions.find(partition =>
      isPositionInPartition(position, partition)
    );

    if (!targetPartition) return; // Invalid drop position - outside all partitions

    // Check for overlaps with existing ingredients in the same partition
    const overlapping = placedIngredients.some(placed => {
      if (placed.partitionId !== targetPartition.id) return false;
      
      return isOverlapping(
        position,
        draggedIngredient.defaultSize,
        placed.position,
        placed.size
      );
    });

    if (overlapping) return; // Cannot place due to overlap with existing ingredient

    // Check if ingredient fits entirely within partition bounds
    const fits = (
      position.x + draggedIngredient.defaultSize.width <= targetPartition.bounds.x + targetPartition.bounds.width &&
      position.y + draggedIngredient.defaultSize.height <= targetPartition.bounds.y + targetPartition.bounds.height
    );

    if (!fits) return; // Ingredient extends beyond partition boundaries

    // All validations passed - execute the drop
    onIngredientDrop(draggedIngredient, {
      partitionId: targetPartition.id,
      position
    });
  };

  return (
    <View 
      testID="bento-box-container"
      style={[styles.container, containerStyle]}
      onTouchEnd={(event) => {
        if (dragPosition) {
          handleDrop(dragPosition);
        }
      }}
    >
      {/* Render partitions */}
      {bentoBox.partitions.map((partition) => (
        <PartitionArea
          key={partition.id}
          partition={partition}
          onDrop={(position) => handleDrop(position)}
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