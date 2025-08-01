import { 
  BentoBox, 
  Partition, 
  PlacedIngredient, 
  ValidationResult, 
  CreateBentoBoxInput,
  CreatePartitionInput,
  CreatePlacedIngredientInput,
  PlacementResult,
  PlacementOperationResult
} from '@/types';

// Constants
const VALID_BENTO_TYPES: readonly BentoBox['type'][] = ['rectangle', 'oval', 'double'];
const VALID_PARTITION_TYPES: readonly Partition['type'][] = ['rice', 'side'];

// Helper functions
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function createDefaultPartitions(dimensions: { width: number; height: number }): Partition[] {
  const halfWidth = dimensions.width / 2;
  
  return [
    {
      id: generateId('partition'),
      type: 'rice',
      bounds: { x: 0, y: 0, width: halfWidth, height: dimensions.height }
    },
    {
      id: generateId('partition'),
      type: 'side',
      bounds: { x: halfWidth, y: 0, width: halfWidth, height: dimensions.height }
    }
  ];
}

function validateNumericField(
  obj: any, 
  fieldName: string, 
  parentName: string,
  mustBePositive: boolean = false
): string[] {
  const errors: string[] = [];
  const value = obj[fieldName];
  
  if (typeof value !== 'number') {
    errors.push(`${parentName}.${fieldName} must be a number`);
    return errors;
  }
  
  const minValue = mustBePositive ? 0 : 0;
  const condition = mustBePositive ? value <= minValue : value < minValue;
  const requirement = mustBePositive ? 'positive' : 'non-negative';
  
  if (condition) {
    errors.push(`${parentName}.${fieldName} must be ${requirement}`);
  }
  
  return errors;
}

function validateObjectWithNumericFields(
  obj: any,
  objName: string,
  fields: Array<{ name: string; mustBePositive?: boolean }>
): string[] {
  const errors: string[] = [];
  
  if (!obj || typeof obj !== 'object') {
    errors.push(`${objName} is required`);
    return errors;
  }
  
  fields.forEach(field => {
    errors.push(...validateNumericField(obj, field.name, objName, field.mustBePositive));
  });
  
  return errors;
}

function validateDimensions(dimensions: any): string[] {
  return validateObjectWithNumericFields(dimensions, 'dimensions', [
    { name: 'width', mustBePositive: true },
    { name: 'height', mustBePositive: true }
  ]);
}

function validateBounds(bounds: any): string[] {
  return validateObjectWithNumericFields(bounds, 'bounds', [
    { name: 'x', mustBePositive: false },
    { name: 'y', mustBePositive: false },
    { name: 'width', mustBePositive: true },
    { name: 'height', mustBePositive: true }
  ]);
}

function isOverlapping(
  pos1: { x: number; y: number },
  size1: { width: number; height: number },
  pos2: { x: number; y: number },
  size2: { width: number; height: number }
): boolean {
  return !(
    pos1.x + size1.width <= pos2.x ||
    pos2.x + size2.width <= pos1.x ||
    pos1.y + size1.height <= pos2.y ||
    pos2.y + size2.height <= pos1.y
  );
}

// Main functions
export function createBentoBox(input: CreateBentoBoxInput): BentoBox {
  const partitions = input.partitions || createDefaultPartitions(input.dimensions);
  
  return {
    id: generateId('bento'),
    type: input.type,
    dimensions: input.dimensions,
    partitions
  };
}

export function validateBentoBox(bentoBox: any): ValidationResult {
  const errors: string[] = [];
  
  // Required fields
  if (!bentoBox.id) errors.push('id is required');
  if (!bentoBox.type) errors.push('type is required');
  if (!Array.isArray(bentoBox.partitions)) errors.push('partitions must be an array');
  
  // Type validation
  if (bentoBox.type && !VALID_BENTO_TYPES.includes(bentoBox.type)) {
    errors.push(`type must be one of: ${VALID_BENTO_TYPES.join(', ')}`);
  }
  
  // Dimensions validation
  errors.push(...validateDimensions(bentoBox.dimensions));
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function createPartition(input: CreatePartitionInput): Partition {
  return {
    id: generateId('partition'),
    type: input.type,
    bounds: input.bounds
  };
}

export function validatePartition(partition: any): ValidationResult {
  const errors: string[] = [];
  
  // Required fields
  if (!partition.id) errors.push('id is required');
  if (!partition.type) errors.push('type is required');
  
  // Type validation
  if (partition.type && !VALID_PARTITION_TYPES.includes(partition.type)) {
    errors.push(`type must be one of: ${VALID_PARTITION_TYPES.join(', ')}`);
  }
  
  // Bounds validation
  errors.push(...validateBounds(partition.bounds));
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function createPlacedIngredient(input: CreatePlacedIngredientInput): PlacedIngredient {
  return {
    id: generateId('placed'),
    ingredientId: input.ingredientId,
    position: input.position,
    size: input.size,
    partitionId: input.partitionId
  };
}

export function validatePlacedIngredient(placedIngredient: any): ValidationResult {
  const errors: string[] = [];
  
  // Required fields
  const requiredFields = ['id', 'ingredientId', 'partitionId'];
  requiredFields.forEach(field => {
    if (!placedIngredient[field]) {
      errors.push(`${field} is required`);
    }
  });
  
  // Position validation
  if (!placedIngredient.position || typeof placedIngredient.position !== 'object') {
    errors.push('position is required');
  } else {
    if (typeof placedIngredient.position.x !== 'number') {
      errors.push('position.x must be a number');
    }
    if (typeof placedIngredient.position.y !== 'number') {
      errors.push('position.y must be a number');
    }
  }
  
  // Size validation
  if (!placedIngredient.size || typeof placedIngredient.size !== 'object') {
    errors.push('size is required');
  } else {
    if (typeof placedIngredient.size.width !== 'number' || placedIngredient.size.width <= 0) {
      errors.push('size.width must be a positive number');
    }
    if (typeof placedIngredient.size.height !== 'number' || placedIngredient.size.height <= 0) {
      errors.push('size.height must be a positive number');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function canPlaceIngredientInPartition(
  placedIngredient: PlacedIngredient,
  partition: Partition,
  existingIngredients: PlacedIngredient[]
): PlacementResult {
  const { position, size } = placedIngredient;
  const { bounds } = partition;
  
  // Check if ingredient fits within partition bounds
  if (
    position.x < bounds.x ||
    position.y < bounds.y ||
    position.x + size.width > bounds.x + bounds.width ||
    position.y + size.height > bounds.y + bounds.height
  ) {
    return {
      canPlace: false,
      reason: 'ingredient extends outside partition bounds'
    };
  }
  
  // Check for overlap with existing ingredients in the same partition
  const ingredientsInPartition = existingIngredients.filter(
    ing => ing.partitionId === partition.id
  );
  
  for (const existing of ingredientsInPartition) {
    if (isOverlapping(position, size, existing.position, existing.size)) {
      return {
        canPlace: false,
        reason: 'ingredient overlaps with existing ingredient'
      };
    }
  }
  
  return { canPlace: true };
}

export function placeIngredientInBentoBox(
  bentoBox: BentoBox,
  ingredientId: string,
  partitionId: string,
  position: { x: number; y: number },
  size: { width: number; height: number },
  existingIngredients: PlacedIngredient[] = []
): PlacementOperationResult {
  // Find target partition
  const partition = bentoBox.partitions.find(p => p.id === partitionId);
  if (!partition) {
    return {
      success: false,
      error: 'partition not found'
    };
  }
  
  // Create placed ingredient
  const placedIngredient = createPlacedIngredient({
    ingredientId,
    partitionId,
    position,
    size
  });
  
  // Check if placement is valid
  const placementResult = canPlaceIngredientInPartition(
    placedIngredient,
    partition,
    existingIngredients
  );
  
  if (!placementResult.canPlace) {
    return {
      success: false,
      error: placementResult.reason
    };
  }
  
  return {
    success: true,
    placedIngredient
  };
}