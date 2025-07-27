import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ingredient } from '@/types';
import { UI_COLORS } from '@/utils/colors';
import {
  ADD_INGREDIENT_FORM_DEFAULTS,
  INGREDIENT_CATEGORIES,
  INGREDIENT_COLORS,
  ADD_INGREDIENT_MODAL_CONFIG,
} from '@/constants/addIngredientModal';

export interface AddIngredientModalProps {
  visible: boolean;
  onSave: (ingredient: Omit<Ingredient, 'id' | 'defaultSize' | 'icon'>) => void;
  onCancel: () => void;
}

export function AddIngredientModal({ visible, onSave, onCancel }: AddIngredientModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Ingredient['category']>(ADD_INGREDIENT_FORM_DEFAULTS.CATEGORY);
  const [color, setColor] = useState<Ingredient['color']>(ADD_INGREDIENT_FORM_DEFAULTS.COLOR);
  const [vitamin, setVitamin] = useState(ADD_INGREDIENT_FORM_DEFAULTS.NUTRITION.VITAMIN.toString());
  const [protein, setProtein] = useState(ADD_INGREDIENT_FORM_DEFAULTS.NUTRITION.PROTEIN.toString());
  const [fiber, setFiber] = useState(ADD_INGREDIENT_FORM_DEFAULTS.NUTRITION.FIBER.toString());
  const [cost, setCost] = useState(ADD_INGREDIENT_FORM_DEFAULTS.COST.toString());
  const [cookingTime, setCookingTime] = useState(ADD_INGREDIENT_FORM_DEFAULTS.COOKING_TIME.toString());

  const handleSave = () => {
    const ingredientData = {
      name,
      category,
      color,
      nutrition: {
        vitamin: parseInt(vitamin) || 0,
        protein: parseInt(protein) || 0,
        fiber: parseInt(fiber) || 0,
      },
      cost: parseInt(cost) || ADD_INGREDIENT_FORM_DEFAULTS.COST,
      cookingTime: parseInt(cookingTime) || ADD_INGREDIENT_FORM_DEFAULTS.COOKING_TIME,
      season: ADD_INGREDIENT_FORM_DEFAULTS.SEASON,
      isFrozen: ADD_INGREDIENT_FORM_DEFAULTS.IS_FROZEN,
      isReadyToEat: ADD_INGREDIENT_FORM_DEFAULTS.IS_READY_TO_EAT,
    };
    onSave(ingredientData);
  };

  const isFormValid = name.trim().length > 0;

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.modal} testID="add-ingredient-modal">
        <View style={styles.scrollContent}>
          {/* Basic Info Section */}
          <View style={styles.section} testID="basic-info-section">
            <Text style={styles.sectionTitle}>基本情報</Text>
            
            <Text style={styles.label}>食材名</Text>
            <View
              style={styles.textInput}
              testID="name-input"
            >
              <Text>{name || '食材名を入力'}</Text>
            </View>
            
            <Text style={styles.label}>カテゴリ</Text>
            <View style={styles.selectorContainer} testID="category-selector">
              {INGREDIENT_CATEGORIES.map((catItem) => (
                <TouchableOpacity
                  key={catItem.value}
                  style={[styles.selectorButton, category === catItem.value && styles.selectorButtonSelected]}
                  onPress={() => setCategory(catItem.value)}
                >
                  <Text style={[styles.selectorText, category === catItem.value && styles.selectorTextSelected]}>
                    {catItem.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={styles.label}>色</Text>
            <View style={styles.selectorContainer} testID="color-selector">
              {INGREDIENT_COLORS.map((colorItem) => (
                <TouchableOpacity
                  key={colorItem.value}
                  style={[styles.colorButton, { backgroundColor: colorItem.hex }, color === colorItem.value && styles.colorButtonSelected]}
                  onPress={() => setColor(colorItem.value)}
                >
                  <Text style={styles.colorText}>{colorItem.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Nutrition Section */}
          <View style={styles.section} testID="nutrition-section">
            <Text style={styles.sectionTitle}>栄養成分</Text>
            
            <Text style={styles.label}>ビタミン (0-100)</Text>
            <View
              style={styles.textInput}
              testID="vitamin-input"
            >
              <Text>{vitamin || '50'}</Text>
            </View>
            
            <Text style={styles.label}>タンパク質 (0-100)</Text>
            <View
              style={styles.textInput}
              testID="protein-input"
            >
              <Text>{protein || '50'}</Text>
            </View>
            
            <Text style={styles.label}>食物繊維 (0-100)</Text>
            <View
              style={styles.textInput}
              testID="fiber-input"
            >
              <Text>{fiber || '50'}</Text>
            </View>
          </View>

          {/* Additional Info Section */}
          <View style={styles.section} testID="additional-info-section">
            <Text style={styles.sectionTitle}>追加情報</Text>
            
            <Text style={styles.label}>コスト (円)</Text>
            <View
              style={styles.textInput}
              testID="cost-input"
            >
              <Text>{cost || '100'}</Text>
            </View>
            
            <Text style={styles.label}>調理時間 (分)</Text>
            <View
              style={styles.textInput}
              testID="cooking-time-input"
            >
              <Text>{cookingTime || '5'}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer} testID="action-buttons-section">
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={onCancel}
            testID="cancel-button"
          >
            <Text style={styles.buttonText}>キャンセル</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.saveButton, !isFormValid && styles.disabledButton]}
            onPress={handleSave}
            disabled={!isFormValid}
            accessibilityState={{ disabled: !isFormValid }}
            testID="save-button"
          >
            <Text style={[styles.buttonText, !isFormValid && styles.disabledText]}>保存</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: UI_COLORS.background.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: UI_COLORS.background.modal,
    borderRadius: ADD_INGREDIENT_MODAL_CONFIG.MODAL.BORDER_RADIUS,
    width: '100%',
    maxWidth: ADD_INGREDIENT_MODAL_CONFIG.MODAL.MAX_WIDTH,
    maxHeight: ADD_INGREDIENT_MODAL_CONFIG.MODAL.MAX_HEIGHT_PERCENT,
  },
  scrollContent: {
    padding: ADD_INGREDIENT_MODAL_CONFIG.ACTION.PADDING,
  },
  section: {
    marginBottom: ADD_INGREDIENT_MODAL_CONFIG.SECTION.MARGIN_BOTTOM,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: UI_COLORS.text.primary,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: UI_COLORS.text.primary,
  },
  textInput: {
    borderWidth: 1,
    borderColor: UI_COLORS.border.light,
    borderRadius: ADD_INGREDIENT_MODAL_CONFIG.INPUT.BORDER_RADIUS,
    padding: ADD_INGREDIENT_MODAL_CONFIG.INPUT.PADDING,
    fontSize: 16,
    marginBottom: ADD_INGREDIENT_MODAL_CONFIG.INPUT.MARGIN_BOTTOM,
    backgroundColor: UI_COLORS.background.modal,
  },
  selectorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: ADD_INGREDIENT_MODAL_CONFIG.INPUT.MARGIN_BOTTOM,
  },
  selectorButton: {
    paddingHorizontal: ADD_INGREDIENT_MODAL_CONFIG.SELECTOR.BUTTON.PADDING_HORIZONTAL,
    paddingVertical: ADD_INGREDIENT_MODAL_CONFIG.SELECTOR.BUTTON.PADDING_VERTICAL,
    borderRadius: ADD_INGREDIENT_MODAL_CONFIG.SELECTOR.BUTTON.BORDER_RADIUS,
    borderWidth: 1,
    borderColor: UI_COLORS.border.light,
    backgroundColor: UI_COLORS.background.modal,
  },
  selectorButtonSelected: {
    backgroundColor: UI_COLORS.primary,
    borderColor: UI_COLORS.primary,
  },
  selectorText: {
    fontSize: 14,
    color: UI_COLORS.text.primary,
  },
  selectorTextSelected: {
    color: UI_COLORS.background.modal,
    fontWeight: 'bold',
  },
  colorButton: {
    paddingHorizontal: ADD_INGREDIENT_MODAL_CONFIG.SELECTOR.BUTTON.PADDING_HORIZONTAL,
    paddingVertical: ADD_INGREDIENT_MODAL_CONFIG.SELECTOR.BUTTON.PADDING_VERTICAL,
    borderRadius: ADD_INGREDIENT_MODAL_CONFIG.SELECTOR.BUTTON.BORDER_RADIUS,
    borderWidth: ADD_INGREDIENT_MODAL_CONFIG.SELECTOR.COLOR_BUTTON.BORDER_WIDTH_NORMAL,
    borderColor: 'transparent',
    minWidth: ADD_INGREDIENT_MODAL_CONFIG.SELECTOR.COLOR_BUTTON.MIN_WIDTH,
    alignItems: 'center',
  },
  colorButtonSelected: {
    borderColor: UI_COLORS.primary,
    borderWidth: ADD_INGREDIENT_MODAL_CONFIG.SELECTOR.COLOR_BUTTON.BORDER_WIDTH_SELECTED,
  },
  colorText: {
    fontSize: 12,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    padding: ADD_INGREDIENT_MODAL_CONFIG.ACTION.PADDING,
    borderTopWidth: 1,
    borderTopColor: UI_COLORS.border.light,
  },
  actionButton: {
    flex: 1,
    paddingVertical: ADD_INGREDIENT_MODAL_CONFIG.ACTION.BUTTON.PADDING_VERTICAL,
    borderRadius: ADD_INGREDIENT_MODAL_CONFIG.ACTION.BUTTON.BORDER_RADIUS,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: UI_COLORS.success,
  },
  cancelButton: {
    backgroundColor: UI_COLORS.destructive,
  },
  disabledButton: {
    backgroundColor: UI_COLORS.border.light,
  },
  buttonText: {
    color: UI_COLORS.background.modal,
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledText: {
    color: UI_COLORS.text.muted,
  },
});