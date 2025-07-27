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
} as const;