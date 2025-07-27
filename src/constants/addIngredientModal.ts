/**
 * AddIngredientModal コンポーネントの設定定数
 */

import { Ingredient } from '@/types';

/** フォームのデフォルト値 */
export const ADD_INGREDIENT_FORM_DEFAULTS = {
  CATEGORY: 'other' as Ingredient['category'],
  COLOR: 'white' as Ingredient['color'],
  NUTRITION: {
    VITAMIN: 50,
    PROTEIN: 50,
    FIBER: 50,
  },
  COST: 100,
  COOKING_TIME: 5,
  SEASON: 'all' as const,
  IS_FROZEN: false,
  IS_READY_TO_EAT: true,
} as const;

/** カテゴリの選択肢と表示ラベル */
export const INGREDIENT_CATEGORIES = [
  { value: 'main', label: 'メイン' },
  { value: 'side', label: 'サイド' },
  { value: 'vegetable', label: '野菜' },
  { value: 'fruit', label: '果物' },
  { value: 'other', label: 'その他' },
] as const;

/** 色の選択肢と表示情報 */
export const INGREDIENT_COLORS = [
  { value: 'red', label: '赤', hex: '#FF6B6B' },
  { value: 'yellow', label: '黄', hex: '#FFD93D' },
  { value: 'green', label: '緑', hex: '#6BCF7F' },
  { value: 'white', label: '白', hex: '#FFFFFF' },
  { value: 'brown', label: '茶', hex: '#D2691E' },
  { value: 'black', label: '黒', hex: '#2C2C2C' },
] as const;

/** フォームの入力制限 */
export const ADD_INGREDIENT_FORM_LIMITS = {
  NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
  },
  NUTRITION: {
    MIN: 0,
    MAX: 100,
  },
  COST: {
    MIN: 0,
    MAX: 10000,
  },
  COOKING_TIME: {
    MIN: 0,
    MAX: 180, // 3時間
  },
} as const;

/** バリデーションエラーメッセージ */
export const ADD_INGREDIENT_VALIDATION_MESSAGES = {
  NAME: {
    REQUIRED: '食材名は必須です',
    TOO_LONG: (maxLength: number) => `食材名は${maxLength}文字以内で入力してください`,
  },
  NUTRITION: {
    OUT_OF_RANGE: (min: number, max: number) => `${min}-${max}の範囲で入力してください`,
  },
  COST: {
    OUT_OF_RANGE: (min: number, max: number) => `${min}-${max}円の範囲で入力してください`,
  },
  COOKING_TIME: {
    OUT_OF_RANGE: (min: number, max: number) => `${min}-${max}分の範囲で入力してください`,
  },
} as const;

/** UI関連の設定 */
export const ADD_INGREDIENT_MODAL_CONFIG = {
  MODAL: {
    MAX_WIDTH: 400,
    MAX_HEIGHT_PERCENT: '90%',
    BORDER_RADIUS: 16,
  },
  SECTION: {
    MARGIN_BOTTOM: 24,
  },
  INPUT: {
    BORDER_RADIUS: 8,
    PADDING: 12,
    MARGIN_BOTTOM: 16,
  },
  SELECTOR: {
    BUTTON: {
      BORDER_RADIUS: 20,
      PADDING_HORIZONTAL: 12,
      PADDING_VERTICAL: 8,
    },
    COLOR_BUTTON: {
      MIN_WIDTH: 50,
      BORDER_WIDTH_SELECTED: 3,
      BORDER_WIDTH_NORMAL: 2,
    },
  },
  ACTION: {
    PADDING: 24,
    BUTTON: {
      BORDER_RADIUS: 8,
      PADDING_VERTICAL: 12,
    },
  },
  VALIDATION: {
    ERROR_TEXT: {
      COLOR: '#FF6B6B',
      FONT_SIZE: 12,
      MARGIN_TOP: 4,
      MARGIN_BOTTOM: 8,
    },
    CONTAINER: {
      PADDING_HORIZONTAL: 24,
      PADDING_VERTICAL: 8,
    },
    SUMMARY: {
      FONT_SIZE: 14,
      FONT_WEIGHT: '500' as const,
      TEXT_ALIGN: 'center' as const,
    },
  },
} as const;

/** バリデーション関数のヘルパー */
export const validateIngredientField = (
  field: 'name' | 'vitamin' | 'protein' | 'fiber' | 'cost' | 'cookingTime',
  value: string
): string | undefined => {
  switch (field) {
    case 'name':
      if (value.trim().length < ADD_INGREDIENT_FORM_LIMITS.NAME.MIN_LENGTH) {
        return ADD_INGREDIENT_VALIDATION_MESSAGES.NAME.REQUIRED;
      }
      if (value.trim().length > ADD_INGREDIENT_FORM_LIMITS.NAME.MAX_LENGTH) {
        return ADD_INGREDIENT_VALIDATION_MESSAGES.NAME.TOO_LONG(ADD_INGREDIENT_FORM_LIMITS.NAME.MAX_LENGTH);
      }
      break;
    case 'vitamin':
    case 'protein':
    case 'fiber':
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < ADD_INGREDIENT_FORM_LIMITS.NUTRITION.MIN || numValue > ADD_INGREDIENT_FORM_LIMITS.NUTRITION.MAX) {
        return ADD_INGREDIENT_VALIDATION_MESSAGES.NUTRITION.OUT_OF_RANGE(
          ADD_INGREDIENT_FORM_LIMITS.NUTRITION.MIN,
          ADD_INGREDIENT_FORM_LIMITS.NUTRITION.MAX
        );
      }
      break;
    case 'cost':
      const costValue = parseInt(value);
      if (isNaN(costValue) || costValue < ADD_INGREDIENT_FORM_LIMITS.COST.MIN || costValue > ADD_INGREDIENT_FORM_LIMITS.COST.MAX) {
        return ADD_INGREDIENT_VALIDATION_MESSAGES.COST.OUT_OF_RANGE(
          ADD_INGREDIENT_FORM_LIMITS.COST.MIN,
          ADD_INGREDIENT_FORM_LIMITS.COST.MAX
        );
      }
      break;
    case 'cookingTime':
      const timeValue = parseInt(value);
      if (isNaN(timeValue) || timeValue < ADD_INGREDIENT_FORM_LIMITS.COOKING_TIME.MIN || timeValue > ADD_INGREDIENT_FORM_LIMITS.COOKING_TIME.MAX) {
        return ADD_INGREDIENT_VALIDATION_MESSAGES.COOKING_TIME.OUT_OF_RANGE(
          ADD_INGREDIENT_FORM_LIMITS.COOKING_TIME.MIN,
          ADD_INGREDIENT_FORM_LIMITS.COOKING_TIME.MAX
        );
      }
      break;
  }
  return undefined;
};

/** バリデーションメッセージ定数 */
export const VALIDATION_UI_MESSAGES = {
  SUMMARY: '入力エラーがあります。各項目を確認してください。',
} as const;