import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { BentoBoxCanvas } from '@/components/BentoBoxCanvas';
import { IngredientList } from '@/components/IngredientList';
import { ActionBar } from '@/components/ActionBar';
import { SuggestionModal } from '@/components/SuggestionModal';
import { AddIngredientModal } from '@/components/AddIngredientModal';
import { getInitialIngredients } from '@/data/initialIngredients';
import { createBentoBox } from '@/utils/bentoBox';
import { PlacedIngredient, Ingredient } from '@/types';
import { SuggestionType, SuggestionResult } from '@/services/suggestionService';
import { IngredientService } from '@/services/ingredientService';
import { DropInfo } from '@/components/BentoBoxCanvas/BentoBoxCanvas';
import { UI_COLORS } from '@/utils/colors';
import { BENTO_DESIGNER_CONFIG } from '@/constants/bentoDesigner';

export interface BentoDesignerProps {
  // Optional props for customization
}

export function BentoDesigner(props: BentoDesignerProps) {
  const [placedIngredients, setPlacedIngredients] = useState<PlacedIngredient[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddIngredientModalVisible, setIsAddIngredientModalVisible] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>(getInitialIngredients());
  
  const bentoBox = createBentoBox(BENTO_DESIGNER_CONFIG.DEFAULT_BENTO_BOX);

  // Load user ingredients on component mount
  useEffect(() => {
    const loadIngredients = async () => {
      try {
        await IngredientService.loadUserIngredients();
        const allIngredients = await IngredientService.getAllWithUserIngredients();
        setIngredients(allIngredients);
      } catch (error) {
        console.error('Failed to load user ingredients:', error);
        // Fallback to initial ingredients if user ingredients fail to load
        setIngredients(getInitialIngredients());
      }
    };
    
    loadIngredients();
  }, []);

  const handleSuggestion = () => {
    setIsModalVisible(true);
  };

  const handleClear = () => {
    setPlacedIngredients([]);
  };

  const handleAddIngredient = () => {
    setIsAddIngredientModalVisible(true);
  };

  const handleIngredientSave = async (ingredientData: Omit<Ingredient, 'id' | 'defaultSize' | 'icon'>) => {
    try {
      // Save the new ingredient
      await IngredientService.addUserIngredient(ingredientData);
      
      // Update the ingredients list
      const updatedIngredients = await IngredientService.getAllWithUserIngredients();
      setIngredients(updatedIngredients);
      
      // Close the modal only on successful save
      setIsAddIngredientModalVisible(false);
    } catch (error) {
      console.error('Failed to save ingredient:', error);
      // TODO: Show user-friendly error message in future iterations
      // For now, keep modal open so user can retry
    }
  };

  const closeAddIngredientModal = () => {
    setIsAddIngredientModalVisible(false);
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
        onAddIngredient={handleAddIngredient}
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

      {/* 食材追加モーダル */}
      <AddIngredientModal
        visible={isAddIngredientModalVisible}
        onSave={handleIngredientSave}
        onCancel={closeAddIngredientModal}
      />
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