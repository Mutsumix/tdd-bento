import { Ingredient, ValidationResult } from '@/types';
import { validateIngredient } from '@/utils/ingredient';

// Constants
const EXPECTED_INGREDIENTS_COUNT = 20;
const DEFAULT_ICON = 'circle';
const ALL_SEASONS = 'all' as const;

// Common defaults
const COMMON_DEFAULTS = {
  season: ALL_SEASONS,
  isFrozen: false,
  isReadyToEat: false,
  icon: DEFAULT_ICON
} as const;

// Helper function to create ingredient with defaults
function createIngredient(
  id: string,
  name: string,
  category: Ingredient['category'],
  color: Ingredient['color'],
  nutrition: Ingredient['nutrition'],
  cookingTime: number,
  cost: number,
  size: { width: number; height: number },
  overrides: Partial<Ingredient> = {}
): Ingredient {
  return {
    id,
    name,
    category,
    color,
    nutrition,
    cookingTime,
    cost,
    defaultSize: size,
    ...COMMON_DEFAULTS,
    ...overrides
  };
}

// Main dishes (5 items)
const MAIN_DISHES: Ingredient[] = [
  createIngredient(
    'ingredient-001',
    '唐揚げ',
    'main',
    'brown',
    { vitamin: 20, protein: 80, fiber: 10 },
    15,
    200,
    { width: 50, height: 30 }
  ),
  createIngredient(
    'ingredient-002',
    '卵焼き',
    'main',
    'yellow',
    { vitamin: 40, protein: 60, fiber: 5 },
    10,
    100,
    { width: 45, height: 25 }
  ),
  createIngredient(
    'ingredient-003',
    'ハンバーグ',
    'main',
    'brown',
    { vitamin: 15, protein: 85, fiber: 5 },
    20,
    250,
    { width: 55, height: 35 }
  ),
  createIngredient(
    'ingredient-004',
    '鮭の塩焼き',
    'main',
    'red',
    { vitamin: 30, protein: 75, fiber: 0 },
    15,
    300,
    { width: 60, height: 25 }
  ),
  createIngredient(
    'ingredient-005',
    'エビフライ',
    'main',
    'red',
    { vitamin: 10, protein: 70, fiber: 5 },
    8,
    180,
    { width: 40, height: 50 },
    { isFrozen: true }
  )
];

// Side dishes (8 items)
const SIDE_DISHES: Ingredient[] = [
  createIngredient(
    'ingredient-006',
    'ブロッコリー',
    'side',
    'green',
    { vitamin: 90, protein: 25, fiber: 60 },
    5,
    80,
    { width: 35, height: 35 }
  ),
  createIngredient(
    'ingredient-007',
    'プチトマト',
    'side',
    'red',
    { vitamin: 80, protein: 15, fiber: 30 },
    0,
    120,
    { width: 25, height: 25 },
    { isReadyToEat: true }
  ),
  createIngredient(
    'ingredient-008',
    'きんぴらごぼう',
    'side',
    'brown',
    { vitamin: 40, protein: 20, fiber: 80 },
    12,
    90,
    { width: 40, height: 20 }
  ),
  createIngredient(
    'ingredient-009',
    'ほうれん草のおひたし',
    'side',
    'green',
    { vitamin: 95, protein: 30, fiber: 50 },
    8,
    70,
    { width: 40, height: 25 }
  ),
  createIngredient(
    'ingredient-010',
    'にんじんのグラッセ',
    'side',
    'red',
    { vitamin: 85, protein: 10, fiber: 40 },
    10,
    60,
    { width: 30, height: 40 }
  ),
  createIngredient(
    'ingredient-011',
    'ポテトサラダ',
    'side',
    'white',
    { vitamin: 50, protein: 40, fiber: 30 },
    15,
    100,
    { width: 45, height: 30 }
  ),
  createIngredient(
    'ingredient-012',
    'ひじきの煮物',
    'side',
    'black',
    { vitamin: 60, protein: 25, fiber: 90 },
    20,
    80,
    { width: 40, height: 25 }
  ),
  createIngredient(
    'ingredient-013',
    '枝豆',
    'side',
    'green',
    { vitamin: 70, protein: 50, fiber: 60 },
    3,
    90,
    { width: 35, height: 20 },
    { season: 'summer', isFrozen: true }
  )
];

// Other items (7 items)
const OTHER_ITEMS: Ingredient[] = [
  createIngredient(
    'ingredient-014',
    '白ごはん',
    'other',
    'white',
    { vitamin: 10, protein: 20, fiber: 20 },
    0,
    50,
    { width: 80, height: 40 },
    { isReadyToEat: true }
  ),
  createIngredient(
    'ingredient-015',
    'おにぎり',
    'other',
    'white',
    { vitamin: 15, protein: 25, fiber: 25 },
    2,
    80,
    { width: 50, height: 50 }
  ),
  createIngredient(
    'ingredient-016',
    'チーズ',
    'other',
    'yellow',
    { vitamin: 25, protein: 65, fiber: 0 },
    0,
    120,
    { width: 30, height: 30 },
    { isReadyToEat: true }
  ),
  createIngredient(
    'ingredient-017',
    'ウインナー',
    'other',
    'red',
    { vitamin: 20, protein: 55, fiber: 5 },
    5,
    150,
    { width: 35, height: 15 }
  ),
  createIngredient(
    'ingredient-018',
    '梅干し',
    'other',
    'red',
    { vitamin: 30, protein: 5, fiber: 20 },
    0,
    40,
    { width: 20, height: 20 },
    { isReadyToEat: true }
  ),
  createIngredient(
    'ingredient-019',
    'たくあん',
    'other',
    'yellow',
    { vitamin: 35, protein: 10, fiber: 40 },
    0,
    30,
    { width: 25, height: 30 },
    { isReadyToEat: true }
  ),
  createIngredient(
    'ingredient-020',
    'いちご',
    'fruit',
    'red',
    { vitamin: 100, protein: 5, fiber: 30 },
    0,
    200,
    { width: 25, height: 30 },
    { season: 'spring', isReadyToEat: true }
  )
];

const INITIAL_INGREDIENTS: Ingredient[] = [
  ...MAIN_DISHES,
  ...SIDE_DISHES,
  ...OTHER_ITEMS
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
  if (INITIAL_INGREDIENTS.length !== EXPECTED_INGREDIENTS_COUNT) {
    errors.push(`Expected ${EXPECTED_INGREDIENTS_COUNT} ingredients, found ${INITIAL_INGREDIENTS.length}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}