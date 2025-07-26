import { Ingredient, ValidationResult, CreateIngredientInput } from '@/types';

export function validateIngredient(ingredient: any): ValidationResult {
  const errors: string[] = [];

  // Required fields check
  if (!ingredient.id) errors.push('id is required');
  if (!ingredient.name) errors.push('name is required');
  if (!ingredient.category) errors.push('category is required');
  if (!ingredient.color) errors.push('color is required');
  if (!ingredient.nutrition) errors.push('nutrition is required');
  if (typeof ingredient.cookingTime !== 'number') errors.push('cookingTime is required');
  if (typeof ingredient.cost !== 'number') errors.push('cost is required');
  if (typeof ingredient.isFrozen !== 'boolean') errors.push('isFrozen is required');
  if (typeof ingredient.isReadyToEat !== 'boolean') errors.push('isReadyToEat is required');
  if (!ingredient.defaultSize) errors.push('defaultSize is required');
  if (!ingredient.icon) errors.push('icon is required');

  // Nutrition validation
  if (ingredient.nutrition) {
    const { vitamin, protein, fiber } = ingredient.nutrition;
    
    if (typeof vitamin !== 'number' || vitamin < 0 || vitamin > 100) {
      errors.push('nutrition.vitamin must be between 0 and 100');
    }
    
    if (typeof protein !== 'number' || protein < 0 || protein > 100) {
      errors.push('nutrition.protein must be between 0 and 100');
    }
    
    if (typeof fiber !== 'number' || fiber < 0 || fiber > 100) {
      errors.push('nutrition.fiber must be between 0 and 100');
    }
  }

  // Category validation
  const validCategories = ['main', 'side', 'vegetable', 'fruit', 'other'];
  if (ingredient.category && !validCategories.includes(ingredient.category)) {
    errors.push('category must be one of: main, side, vegetable, fruit, other');
  }

  // Color validation
  const validColors = ['red', 'yellow', 'green', 'white', 'brown', 'black'];
  if (ingredient.color && !validColors.includes(ingredient.color)) {
    errors.push('color must be one of: red, yellow, green, white, brown, black');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function createIngredient(input: CreateIngredientInput): Ingredient {
  const ingredient: Ingredient = {
    id: input.id || `ingredient-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: input.name,
    category: input.category,
    color: input.color,
    nutrition: input.nutrition || {
      vitamin: 0,
      protein: 0,
      fiber: 0
    },
    cookingTime: input.cookingTime || 0,
    cost: input.cost || 0,
    season: input.season || 'all',
    isFrozen: input.isFrozen || false,
    isReadyToEat: input.isReadyToEat || false,
    defaultSize: input.defaultSize || { width: 40, height: 30 },
    icon: input.icon || 'circle'
  };

  return ingredient;
}