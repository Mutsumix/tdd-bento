import { Partition } from '@/types';

/**
 * Color configuration for different partition types
 */
export const PARTITION_COLORS = {
  rice: {
    backgroundColor: '#ffffff',    // Pure white for rice compartment
    borderColor: '#e0e0e0'        // Light gray border for rice
  },
  side: {
    backgroundColor: '#f5f5f5',    // Light gray for side dish compartment
    borderColor: '#d0d0d0'        // Slightly darker gray border for side
  }
} as const;

/**
 * Gets the color configuration for a specific partition type
 * @param partitionType The type of partition ('rice' | 'side')
 * @returns Color configuration object with backgroundColor and borderColor
 */
export function getPartitionColors(partitionType: Partition['type']) {
  return PARTITION_COLORS[partitionType] || PARTITION_COLORS.rice;
}