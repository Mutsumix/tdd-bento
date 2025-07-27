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
import { PlacedIngredientService } from '@/services/placedIngredientService';
import { DragPosition } from '@/components/IngredientList/IngredientItem/IngredientItem';
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
  
  // Drag state management
  const [draggedIngredient, setDraggedIngredient] = useState<Ingredient | undefined>(undefined);
  const [dragPosition, setDragPosition] = useState<DragPosition | undefined>(undefined);
  
  const bentoBox = createBentoBox(BENTO_DESIGNER_CONFIG.DEFAULT_BENTO_BOX);

  // Load user ingredients and placed ingredients on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user ingredients
        await IngredientService.loadUserIngredients();
        const allIngredients = await IngredientService.getAllWithUserIngredients();
        setIngredients(allIngredients);
        
        // Load placed ingredients
        const savedPlacedIngredients = await PlacedIngredientService.loadFromStorage();
        setPlacedIngredients(savedPlacedIngredients);
      } catch (error) {
        console.error('Failed to load data:', error);
        // Fallback to initial ingredients if loading fails
        setIngredients(getInitialIngredients());
        setPlacedIngredients([]);
      }
    };
    
    loadData();
  }, []);

  const handleSuggestion = () => {
    setIsModalVisible(true);
  };

  const handleClear = async () => {
    try {
      setPlacedIngredients([]);
      await PlacedIngredientService.saveToStorage([]);
    } catch (error) {
      console.error('Failed to clear placed ingredients:', error);
    }
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

  // Drag handlers
  const handleDragStart = (ingredient: Ingredient) => {
    setDraggedIngredient(ingredient);
  };

  const handleDragEnd = (ingredient: Ingredient, position: DragPosition) => {
    setDragPosition(position);
    // Note: actual drop handling is done in BentoBoxCanvas handleDrop
  };

  const handleSuggestionAdopt = (suggestion: SuggestionResult) => {
    // TODO: Implement suggestion adoption logic
    closeModal();
  };

  const handleSuggestionNext = () => {
    // TODO: Implement next suggestion logic
  };

  const handleIngredientDrop = async (ingredient: Ingredient, dropInfo: DropInfo) => {
    try {
      // Create placed ingredient
      const placedIngredient = PlacedIngredientService.createPlacedIngredient({
        ingredientId: ingredient.id,
        partitionId: dropInfo.partitionId,
        position: dropInfo.position,
        size: ingredient.defaultSize
      });
      
      // Add to local state
      const updatedPlacedIngredients = PlacedIngredientService.addPlacedIngredient(
        placedIngredients,
        placedIngredient
      );
      setPlacedIngredients(updatedPlacedIngredients);
      
      // Save to storage
      await PlacedIngredientService.saveToStorage(updatedPlacedIngredients);
      
      // Clear drag state
      setDraggedIngredient(undefined);
      setDragPosition(undefined);
    } catch (error) {
      console.error('Failed to place ingredient:', error);
      // Clear drag state even on error
      setDraggedIngredient(undefined);
      setDragPosition(undefined);
    }
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
          draggedIngredient={draggedIngredient}
          dragPosition={dragPosition}
        />
      </View>
      
      {/* 食材リスト（中部） */}
      <View style={styles.ingredientContainer}>
        <IngredientList
          ingredients={ingredients}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
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