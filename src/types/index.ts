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