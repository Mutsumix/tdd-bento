export interface Ingredient {
  id: string;
  name: string;
  category: 'main' | 'side' | 'vegetable' | 'fruit' | 'other';
  color: 'red' | 'yellow' | 'green' | 'white' | 'brown' | 'black';
  nutrition: {
    vitamin: number;  // 0-100
    protein: number;  // 0-100
    fiber: number;    // 0-100
  };
  cookingTime: number;  // 分
  cost: number;         // 円
  season?: 'spring' | 'summer' | 'autumn' | 'winter' | 'all';
  isFrozen: boolean;    // 冷凍食品フラグ
  isReadyToEat: boolean; // そのまま詰められるフラグ
  defaultSize: { width: number; height: number }; // デフォルトサイズ
  icon: string;         // SVGパスまたは簡易図形データ
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export type CreateIngredientInput = Partial<Ingredient> & {
  name: string;
  category: Ingredient['category'];
  color: Ingredient['color'];
};

export interface BentoBox {
  id: string;
  type: 'rectangle' | 'oval' | 'double';
  dimensions: { width: number; height: number };
  partitions: Partition[];
}

export interface Partition {
  id: string;
  type: 'rice' | 'side';
  bounds: { x: number; y: number; width: number; height: number };
}

export interface PlacedIngredient {
  id: string;
  ingredientId: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  partitionId: string;
}

export type CreateBentoBoxInput = {
  type: BentoBox['type'];
  dimensions: BentoBox['dimensions'];
  partitions?: Partition[];
};

export type CreatePartitionInput = {
  type: Partition['type'];
  bounds: Partition['bounds'];
};

export type CreatePlacedIngredientInput = {
  ingredientId: string;
  partitionId: string;
  position: PlacedIngredient['position'];
  size: PlacedIngredient['size'];
};

export interface PlacementResult {
  canPlace: boolean;
  reason?: string;
}

export interface PlacementOperationResult {
  success: boolean;
  placedIngredient?: PlacedIngredient;
  error?: string;
}