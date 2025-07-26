import { Ingredient, ValidationResult, CreateIngredientInput } from '@/types';

// Constants
const VALID_CATEGORIES: readonly Ingredient['category'][] = ['main', 'side', 'vegetable', 'fruit', 'other'];
const VALID_COLORS: readonly Ingredient['color'][] = ['red', 'yellow', 'green', 'white', 'brown', 'black'];
const NUTRITION_MIN = 0;
const NUTRITION_MAX = 100;

const DEFAULT_NUTRITION = {
  vitamin: 0,
  protein: 0,
  fiber: 0
};

const DEFAULT_SIZE = { width: 40, height: 30 };

// Helper functions
function generateIngredientId(): string {
  return `ingredient-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function validateNutritionValue(value: any, fieldName: string): string | null {
  if (typeof value !== 'number' || value < NUTRITION_MIN || value > NUTRITION_MAX) {
    return `nutrition.${fieldName} must be between ${NUTRITION_MIN} and ${NUTRITION_MAX}`;
  }
  return null;
}

function validateRequiredFields(ingredient: any): string[] {
  const errors: string[] = [];
  const requiredFields = {
    id: 'string',
    name: 'string',
    category: 'string',
    color: 'string',
    nutrition: 'object',
    cookingTime: 'number',
    cost: 'number',
    isFrozen: 'boolean',
    isReadyToEat: 'boolean',
    defaultSize: 'object',
    icon: 'string'
  };

  Object.entries(requiredFields).forEach(([field, expectedType]) => {
    const value = ingredient[field];
    if (expectedType === 'object') {
      if (!value || typeof value !== 'object') {
        errors.push(`${field} is required`);
      }
    } else if (typeof value !== expectedType) {
      errors.push(`${field} is required`);
    }
  });

  return errors;
}

function validateNutrition(nutrition: any): string[] {
  const errors: string[] = [];
  
  if (!nutrition) return errors;

  const { vitamin, protein, fiber } = nutrition;
  
  [
    validateNutritionValue(vitamin, 'vitamin'),
    validateNutritionValue(protein, 'protein'),
    validateNutritionValue(fiber, 'fiber')
  ].forEach(error => {
    if (error) errors.push(error);
  });

  return errors;
}

function validateEnumFields(ingredient: any): string[] {
  const errors: string[] = [];

  if (ingredient.category && !VALID_CATEGORIES.includes(ingredient.category)) {
    errors.push(`category must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }

  if (ingredient.color && !VALID_COLORS.includes(ingredient.color)) {
    errors.push(`color must be one of: ${VALID_COLORS.join(', ')}`);
  }

  return errors;
}

// Main validation function
export function validateIngredient(ingredient: any): ValidationResult {
  const errors: string[] = [
    ...validateRequiredFields(ingredient),
    ...validateNutrition(ingredient.nutrition),
    ...validateEnumFields(ingredient)
  ];

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function createIngredient(input: CreateIngredientInput): Ingredient {
  return {
    id: input.id || generateIngredientId(),
    name: input.name,
    category: input.category,
    color: input.color,
    nutrition: input.nutrition || DEFAULT_NUTRITION,
    cookingTime: input.cookingTime ?? 0,
    cost: input.cost ?? 0,
    season: input.season || 'all',
    isFrozen: input.isFrozen ?? false,
    isReadyToEat: input.isReadyToEat ?? false,
    defaultSize: input.defaultSize || DEFAULT_SIZE,
    icon: input.icon || 'circle'
  };
}