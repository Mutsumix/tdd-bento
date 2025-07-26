import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Partition } from '@/types';

export interface PartitionAreaProps {
  partition: Partition;
  onDrop?: (position: { x: number; y: number }) => void;
}

export function PartitionArea({ partition, onDrop }: PartitionAreaProps) {
  const dynamicStyle: ViewStyle = {
    position: 'absolute',
    left: partition.bounds.x,
    top: partition.bounds.y,
    width: partition.bounds.width,
    height: partition.bounds.height
  };

  const handleDrop = (event: any) => {
    if (onDrop && event.nativeEvent) {
      const position = {
        x: event.nativeEvent.position?.x || 0,
        y: event.nativeEvent.position?.y || 0
      };
      onDrop(position);
    }
  };

  return (
    <View
      testID={`partition-${partition.id}`}
      style={[styles.partition, dynamicStyle]}
      onTouchEnd={handleDrop}
    />
  );
}

const styles = StyleSheet.create({
  partition: {
    borderWidth: 1,
    borderColor: '#999',
    borderStyle: 'dashed'
  }
});