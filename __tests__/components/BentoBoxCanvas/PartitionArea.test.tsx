import React from 'react';
import { render } from '@testing-library/react-native';
import { PartitionArea } from '@/components/BentoBoxCanvas/PartitionArea';
import { Partition } from '@/types';

// Mock data
const mockRicePartition: Partition = {
  id: 'partition-rice-1',
  type: 'rice',
  bounds: { x: 0, y: 0, width: 150, height: 200 }
};

const mockSidePartition: Partition = {
  id: 'partition-side-1', 
  type: 'side',
  bounds: { x: 150, y: 0, width: 150, height: 200 }
};

describe('PartitionArea Visual Distinction', () => {
  it('should render rice partition with white background color', () => {
    const { getByTestId } = render(
      <PartitionArea partition={mockRicePartition} />
    );
    
    const partitionElement = getByTestId('partition-partition-rice-1');
    const styles = partitionElement.props.style;
    
    // Rice partition should have white/light background
    expect(styles).toMatchObject({
      backgroundColor: '#ffffff'
    });
  });

  it('should render side partition with light gray background color', () => {
    const { getByTestId } = render(
      <PartitionArea partition={mockSidePartition} />
    );
    
    const partitionElement = getByTestId('partition-partition-side-1');
    const styles = partitionElement.props.style;
    
    // Side partition should have light gray background
    expect(styles).toMatchObject({
      backgroundColor: '#f5f5f5'
    });
  });

  it('should apply type-specific styling for rice partition', () => {
    const { getByTestId } = render(
      <PartitionArea partition={mockRicePartition} />
    );
    
    const partitionElement = getByTestId('partition-partition-rice-1');
    const styles = partitionElement.props.style;
    
    // Rice partition should have specific visual characteristics
    expect(styles).toMatchObject({
      backgroundColor: '#ffffff',
      borderColor: '#e0e0e0'
    });
  });

  it('should apply type-specific styling for side partition', () => {
    const { getByTestId } = render(
      <PartitionArea partition={mockSidePartition} />
    );
    
    const partitionElement = getByTestId('partition-partition-side-1');
    const styles = partitionElement.props.style;
    
    // Side partition should have specific visual characteristics
    expect(styles).toMatchObject({
      backgroundColor: '#f5f5f5',
      borderColor: '#d0d0d0'
    });
  });

  it('should maintain correct positioning and dimensions', () => {
    const { getByTestId } = render(
      <PartitionArea partition={mockRicePartition} />
    );
    
    const partitionElement = getByTestId('partition-partition-rice-1');
    const styles = partitionElement.props.style;
    
    // Should preserve existing positioning logic
    expect(styles).toMatchObject({
      position: 'absolute',
      left: 0,
      top: 0,
      width: 150,
      height: 200
    });
  });

  it('should render with type-specific testID pattern', () => {
    const { getByTestId } = render(
      <PartitionArea partition={mockRicePartition} />
    );
    
    // Should be able to find element with partition-specific testID
    expect(getByTestId('partition-partition-rice-1')).toBeTruthy();
  });

  it('should handle onDrop callback regardless of partition type', () => {
    const mockOnDrop = jest.fn();
    const { getByTestId } = render(
      <PartitionArea partition={mockRicePartition} onDrop={mockOnDrop} />
    );
    
    const partitionElement = getByTestId('partition-partition-rice-1');
    expect(partitionElement).toBeTruthy();
    // Drop functionality should be preserved
  });
});