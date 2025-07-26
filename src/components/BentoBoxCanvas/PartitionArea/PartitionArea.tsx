import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Partition } from '@/types';

export interface PartitionAreaProps {
  partition: Partition;
}

export function PartitionArea({ partition }: PartitionAreaProps) {
  const dynamicStyle: ViewStyle = {
    position: 'absolute',
    left: partition.bounds.x,
    top: partition.bounds.y,
    width: partition.bounds.width,
    height: partition.bounds.height
  };

  return (
    <View
      testID={`partition-${partition.id}`}
      style={[styles.partition, dynamicStyle]}
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