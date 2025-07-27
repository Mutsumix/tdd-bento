import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BentoBoxCanvas } from '@/components/BentoBoxCanvas';
import { IngredientList } from '@/components/IngredientList';
import { ActionBar } from '@/components/ActionBar';
import { SuggestionModal } from '@/components/SuggestionModal';
import { getInitialIngredients } from '@/data/initialIngredients';
import { createBentoBox } from '@/utils/bentoBox';
import { PlacedIngredient, Ingredient } from '@/types';
import { SuggestionType, SuggestionResult } from '@/services/suggestionService';
import { DropInfo } from '@/components/BentoBoxCanvas/BentoBoxCanvas';
import { UI_COLORS } from '@/utils/colors';
import { BENTO_DESIGNER_CONFIG } from '@/constants/bentoDesigner';

export interface BentoDesignerProps {
  // Optional props for customization
}

export function BentoDesigner(props: BentoDesignerProps) {
  const [placedIngredients, setPlacedIngredients] = useState<PlacedIngredient[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const ingredients = getInitialIngredients();
  const bentoBox = createBentoBox(BENTO_DESIGNER_CONFIG.DEFAULT_BENTO_BOX);

  const handleSuggestion = () => {
    setIsModalVisible(true);
  };

  const handleClear = () => {
    setPlacedIngredients([]);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleSuggestionAdopt = (suggestion: SuggestionResult) => {
    // TODO: Implement suggestion adoption logic
    closeModal();
  };

  const handleSuggestionNext = () => {
    // TODO: Implement next suggestion logic
  };

  const handleIngredientDrop = (ingredient: Ingredient, dropInfo: DropInfo) => {
    // TODO: Implement drop logic with proper validation
    console.log('Ingredient dropped:', ingredient, dropInfo);
  };

  const hasPlacedIngredients = placedIngredients.length > 0;

  return (
    <View style={styles.container} testID="bento-designer">
      {/* お弁当箱表示エリア（上部） */}
      <View style={styles.bentoContainer} testID="bento-container">
        <BentoBoxCanvas
          bentoBox={bentoBox}
          placedIngredients={placedIngredients}
          onIngredientDrop={handleIngredientDrop}
        />
      </View>
      
      {/* 食材リスト（中部） */}
      <View style={styles.ingredientContainer}>
        <IngredientList
          ingredients={ingredients}
        />
      </View>
      
      {/* アクションバー（下部） */}
      <ActionBar
        onSuggestion={handleSuggestion}
        onClear={handleClear}
        hasPlacedIngredients={hasPlacedIngredients}
      />
      
      {/* 提案モーダル */}
      {isModalVisible && (
        <SuggestionModal
          visible={isModalVisible}
          ingredients={ingredients}
          onAdopt={handleSuggestionAdopt}
          onNext={handleSuggestionNext}
          onCancel={closeModal}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UI_COLORS.background.modal,
  },
  bentoContainer: {
    flex: BENTO_DESIGNER_CONFIG.LAYOUT.BENTO_FLEX,
    padding: BENTO_DESIGNER_CONFIG.LAYOUT.CONTAINER_PADDING,
  },
  ingredientContainer: {
    flex: BENTO_DESIGNER_CONFIG.LAYOUT.INGREDIENT_FLEX,
    borderTopWidth: BENTO_DESIGNER_CONFIG.LAYOUT.BORDER_WIDTH,
    borderTopColor: UI_COLORS.border.light,
  },
});