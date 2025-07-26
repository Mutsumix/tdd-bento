import { Ingredient, ValidationResult } from '@/types';
import { validateIngredient } from '@/utils/ingredient';

const INITIAL_INGREDIENTS: Ingredient[] = [
  // 主菜（5種類）
  {
    id: 'ingredient-001',
    name: '唐揚げ',
    category: 'main',
    color: 'brown',
    nutrition: {
      vitamin: 20,
      protein: 80,
      fiber: 10
    },
    cookingTime: 15,
    cost: 200,
    season: 'all',
    isFrozen: false,
    isReadyToEat: false,
    defaultSize: { width: 50, height: 30 },
    icon: 'circle'
  },
  {
    id: 'ingredient-002',
    name: '卵焼き',
    category: 'main',
    color: 'yellow',
    nutrition: {
      vitamin: 40,
      protein: 60,
      fiber: 5
    },
    cookingTime: 10,
    cost: 100,
    season: 'all',
    isFrozen: false,
    isReadyToEat: false,
    defaultSize: { width: 45, height: 25 },
    icon: 'circle'
  },
  {
    id: 'ingredient-003',
    name: 'ハンバーグ',
    category: 'main',
    color: 'brown',
    nutrition: {
      vitamin: 15,
      protein: 85,
      fiber: 5
    },
    cookingTime: 20,
    cost: 250,
    season: 'all',
    isFrozen: false,
    isReadyToEat: false,
    defaultSize: { width: 55, height: 35 },
    icon: 'circle'
  },
  {
    id: 'ingredient-004',
    name: '鮭の塩焼き',
    category: 'main',
    color: 'red',
    nutrition: {
      vitamin: 30,
      protein: 75,
      fiber: 0
    },
    cookingTime: 15,
    cost: 300,
    season: 'all',
    isFrozen: false,
    isReadyToEat: false,
    defaultSize: { width: 60, height: 25 },
    icon: 'circle'
  },
  {
    id: 'ingredient-005',
    name: 'エビフライ',
    category: 'main',
    color: 'red',
    nutrition: {
      vitamin: 10,
      protein: 70,
      fiber: 5
    },
    cookingTime: 8,
    cost: 180,
    season: 'all',
    isFrozen: true,
    isReadyToEat: false,
    defaultSize: { width: 40, height: 50 },
    icon: 'circle'
  },

  // 副菜（8種類）
  {
    id: 'ingredient-006',
    name: 'ブロッコリー',
    category: 'side',
    color: 'green',
    nutrition: {
      vitamin: 90,
      protein: 25,
      fiber: 60
    },
    cookingTime: 5,
    cost: 80,
    season: 'all',
    isFrozen: false,
    isReadyToEat: false,
    defaultSize: { width: 35, height: 35 },
    icon: 'circle'
  },
  {
    id: 'ingredient-007',
    name: 'プチトマト',
    category: 'side',
    color: 'red',
    nutrition: {
      vitamin: 80,
      protein: 15,
      fiber: 30
    },
    cookingTime: 0,
    cost: 120,
    season: 'all',
    isFrozen: false,
    isReadyToEat: true,
    defaultSize: { width: 25, height: 25 },
    icon: 'circle'
  },
  {
    id: 'ingredient-008',
    name: 'きんぴらごぼう',
    category: 'side',
    color: 'brown',
    nutrition: {
      vitamin: 40,
      protein: 20,
      fiber: 80
    },
    cookingTime: 12,
    cost: 90,
    season: 'all',
    isFrozen: false,
    isReadyToEat: false,
    defaultSize: { width: 40, height: 20 },
    icon: 'circle'
  },
  {
    id: 'ingredient-009',
    name: 'ほうれん草のおひたし',
    category: 'side',
    color: 'green',
    nutrition: {
      vitamin: 95,
      protein: 30,
      fiber: 50
    },
    cookingTime: 8,
    cost: 70,
    season: 'all',
    isFrozen: false,
    isReadyToEat: false,
    defaultSize: { width: 40, height: 25 },
    icon: 'circle'
  },
  {
    id: 'ingredient-010',
    name: 'にんじんのグラッセ',
    category: 'side',
    color: 'red',
    nutrition: {
      vitamin: 85,
      protein: 10,
      fiber: 40
    },
    cookingTime: 10,
    cost: 60,
    season: 'all',
    isFrozen: false,
    isReadyToEat: false,
    defaultSize: { width: 30, height: 40 },
    icon: 'circle'
  },
  {
    id: 'ingredient-011',
    name: 'ポテトサラダ',
    category: 'side',
    color: 'white',
    nutrition: {
      vitamin: 50,
      protein: 40,
      fiber: 30
    },
    cookingTime: 15,
    cost: 100,
    season: 'all',
    isFrozen: false,
    isReadyToEat: false,
    defaultSize: { width: 45, height: 30 },
    icon: 'circle'
  },
  {
    id: 'ingredient-012',
    name: 'ひじきの煮物',
    category: 'side',
    color: 'black',
    nutrition: {
      vitamin: 60,
      protein: 25,
      fiber: 90
    },
    cookingTime: 20,
    cost: 80,
    season: 'all',
    isFrozen: false,
    isReadyToEat: false,
    defaultSize: { width: 40, height: 25 },
    icon: 'circle'
  },
  {
    id: 'ingredient-013',
    name: '枝豆',
    category: 'side',
    color: 'green',
    nutrition: {
      vitamin: 70,
      protein: 50,
      fiber: 60
    },
    cookingTime: 3,
    cost: 90,
    season: 'summer',
    isFrozen: true,
    isReadyToEat: false,
    defaultSize: { width: 35, height: 20 },
    icon: 'circle'
  },

  // その他（7種類）
  {
    id: 'ingredient-014',
    name: '白ごはん',
    category: 'other',
    color: 'white',
    nutrition: {
      vitamin: 10,
      protein: 20,
      fiber: 20
    },
    cookingTime: 0,
    cost: 50,
    season: 'all',
    isFrozen: false,
    isReadyToEat: true,
    defaultSize: { width: 80, height: 40 },
    icon: 'circle'
  },
  {
    id: 'ingredient-015',
    name: 'おにぎり',
    category: 'other',
    color: 'white',
    nutrition: {
      vitamin: 15,
      protein: 25,
      fiber: 25
    },
    cookingTime: 2,
    cost: 80,
    season: 'all',
    isFrozen: false,
    isReadyToEat: false,
    defaultSize: { width: 50, height: 50 },
    icon: 'circle'
  },
  {
    id: 'ingredient-016',
    name: 'チーズ',
    category: 'other',
    color: 'yellow',
    nutrition: {
      vitamin: 25,
      protein: 65,
      fiber: 0
    },
    cookingTime: 0,
    cost: 120,
    season: 'all',
    isFrozen: false,
    isReadyToEat: true,
    defaultSize: { width: 30, height: 30 },
    icon: 'circle'
  },
  {
    id: 'ingredient-017',
    name: 'ウインナー',
    category: 'other',
    color: 'red',
    nutrition: {
      vitamin: 20,
      protein: 55,
      fiber: 5
    },
    cookingTime: 5,
    cost: 150,
    season: 'all',
    isFrozen: false,
    isReadyToEat: false,
    defaultSize: { width: 35, height: 15 },
    icon: 'circle'
  },
  {
    id: 'ingredient-018',
    name: '梅干し',
    category: 'other',
    color: 'red',
    nutrition: {
      vitamin: 30,
      protein: 5,
      fiber: 20
    },
    cookingTime: 0,
    cost: 40,
    season: 'all',
    isFrozen: false,
    isReadyToEat: true,
    defaultSize: { width: 20, height: 20 },
    icon: 'circle'
  },
  {
    id: 'ingredient-019',
    name: 'たくあん',
    category: 'other',
    color: 'yellow',
    nutrition: {
      vitamin: 35,
      protein: 10,
      fiber: 40
    },
    cookingTime: 0,
    cost: 30,
    season: 'all',
    isFrozen: false,
    isReadyToEat: true,
    defaultSize: { width: 25, height: 30 },
    icon: 'circle'
  },
  {
    id: 'ingredient-020',
    name: 'いちご',
    category: 'fruit',
    color: 'red',
    nutrition: {
      vitamin: 100,
      protein: 5,
      fiber: 30
    },
    cookingTime: 0,
    cost: 200,
    season: 'spring',
    isFrozen: false,
    isReadyToEat: true,
    defaultSize: { width: 25, height: 30 },
    icon: 'circle'
  }
];

// Utility functions
export function getInitialIngredients(): Ingredient[] {
  return [...INITIAL_INGREDIENTS];
}

export function getIngredientsByCategory(category: Ingredient['category']): Ingredient[] {
  return INITIAL_INGREDIENTS.filter(ingredient => ingredient.category === category);
}

export function getIngredientsByColor(color: Ingredient['color']): Ingredient[] {
  return INITIAL_INGREDIENTS.filter(ingredient => ingredient.color === color);
}

export function getIngredientsBySeason(season: Ingredient['season']): Ingredient[] {
  return INITIAL_INGREDIENTS.filter(ingredient => 
    ingredient.season === season || ingredient.season === 'all'
  );
}

export function getFrozenIngredients(): Ingredient[] {
  return INITIAL_INGREDIENTS.filter(ingredient => ingredient.isFrozen);
}

export function getReadyToEatIngredients(): Ingredient[] {
  return INITIAL_INGREDIENTS.filter(ingredient => ingredient.isReadyToEat);
}

export function validateInitialIngredientsData(): ValidationResult {
  const errors: string[] = [];
  
  // Check for duplicate IDs
  const ids = INITIAL_INGREDIENTS.map(ingredient => ingredient.id);
  const uniqueIds = new Set(ids);
  
  if (uniqueIds.size !== ids.length) {
    errors.push('Duplicate ingredient IDs found');
  }
  
  // Check for duplicate names
  const names = INITIAL_INGREDIENTS.map(ingredient => ingredient.name);
  const uniqueNames = new Set(names);
  
  if (uniqueNames.size !== names.length) {
    errors.push('Duplicate ingredient names found');
  }
  
  // Validate each ingredient individually
  INITIAL_INGREDIENTS.forEach((ingredient, index) => {
    const validation = validateIngredient(ingredient);
    if (!validation.isValid) {
      errors.push(`Ingredient ${index + 1} (${ingredient.name}) validation failed: ${validation.errors.join(', ')}`);
    }
  });
  
  // Check expected count
  if (INITIAL_INGREDIENTS.length !== 20) {
    errors.push(`Expected 20 ingredients, found ${INITIAL_INGREDIENTS.length}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}