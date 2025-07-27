import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ingredient } from '@/types';
import { UI_COLORS } from '@/utils/colors';

export interface AddIngredientModalProps {
  visible: boolean;
  onSave: (ingredient: Omit<Ingredient, 'id' | 'defaultSize' | 'icon'>) => void;
  onCancel: () => void;
}

export function AddIngredientModal({ visible, onSave, onCancel }: AddIngredientModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Ingredient['category']>('other');
  const [color, setColor] = useState<Ingredient['color']>('white');
  const [vitamin, setVitamin] = useState('50');
  const [protein, setProtein] = useState('50');
  const [fiber, setFiber] = useState('50');
  const [cost, setCost] = useState('100');
  const [cookingTime, setCookingTime] = useState('5');

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
      cost: parseInt(cost) || 0,
      cookingTime: parseInt(cookingTime) || 0,
      season: 'all' as const,
      isFrozen: false,
      isReadyToEat: true,
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
              {(['main', 'side', 'vegetable', 'fruit', 'other'] as const).map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.selectorButton, category === cat && styles.selectorButtonSelected]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.selectorText, category === cat && styles.selectorTextSelected]}>
                    {getCategoryLabel(cat)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={styles.label}>色</Text>
            <View style={styles.selectorContainer} testID="color-selector">
              {(['red', 'yellow', 'green', 'white', 'brown', 'black'] as const).map((col) => (
                <TouchableOpacity
                  key={col}
                  style={[styles.colorButton, { backgroundColor: getColorValue(col) }, color === col && styles.colorButtonSelected]}
                  onPress={() => setColor(col)}
                >
                  <Text style={styles.colorText}>{getColorLabel(col)}</Text>
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

function getCategoryLabel(category: Ingredient['category']): string {
  const labels = {
    main: 'メイン',
    side: 'サイド',
    vegetable: '野菜',
    fruit: '果物',
    other: 'その他'
  };
  return labels[category];
}

function getColorLabel(color: Ingredient['color']): string {
  const labels = {
    red: '赤',
    yellow: '黄',
    green: '緑',
    white: '白',
    brown: '茶',
    black: '黒'
  };
  return labels[color];
}

function getColorValue(color: Ingredient['color']): string {
  const colors = {
    red: '#FF6B6B',
    yellow: '#FFD93D',
    green: '#6BCF7F',
    white: '#FFFFFF',
    brown: '#D2691E',
    black: '#2C2C2C'
  };
  return colors[color];
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
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
  },
  scrollContent: {
    padding: 24,
  },
  section: {
    marginBottom: 24,
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
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: UI_COLORS.background.modal,
  },
  selectorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  selectorButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 50,
    alignItems: 'center',
  },
  colorButtonSelected: {
    borderColor: UI_COLORS.primary,
    borderWidth: 3,
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
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: UI_COLORS.border.light,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
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