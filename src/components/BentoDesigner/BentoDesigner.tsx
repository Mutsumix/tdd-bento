import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { BentoBoxCanvas } from '@/components/BentoBoxCanvas';
import { IngredientList } from '@/components/IngredientList';
import { ActionBar } from '@/components/ActionBar';
import { SuggestionModal } from '@/components/SuggestionModal';
import { AddIngredientModal } from '@/components/AddIngredientModal';
import { ErrorMessage } from '@/components/ErrorMessage';
import { getInitialIngredients } from '@/data/initialIngredients';
import { createBentoBox } from '@/utils/bentoBox';
import { PlacedIngredient, Ingredient } from '@/types';
import { SuggestionType, SuggestionResult } from '@/services/suggestionService';
import { IngredientService } from '@/services/ingredientService';
import { DropInfo } from '@/components/BentoBoxCanvas/BentoBoxCanvas';
import { PlacedIngredientService } from '@/services/placedIngredientService';
import { useDragState } from '@/hooks/useDragState';
import { useErrorState } from '@/hooks/useErrorState';
import { DragPosition } from '@/components/IngredientList/IngredientItem/IngredientItem';
import { DRAG_DROP_ERRORS } from '@/constants/dragDrop';
import { validateDrop } from '@/utils/dragDropValidation';
import { UI_COLORS } from '@/utils/colors';
import { BENTO_DESIGNER_CONFIG } from '@/constants/bentoDesigner';
import { getErrorMessage } from '@/constants/errorMessages';

export interface BentoDesignerProps {
  // Optional props for customization
}

export function BentoDesigner(props: BentoDesignerProps) {
  const [placedIngredients, setPlacedIngredients] = useState<PlacedIngredient[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddIngredientModalVisible, setIsAddIngredientModalVisible] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>(getInitialIngredients());
  
  // Drag state management
  const {
    draggedIngredient,
    dragPosition,
    startDrag,
    updateDragPosition,
    endDrag
  } = useDragState();
  
  // Error state management
  const { error, setError, clearError } = useErrorState();
  
  const bentoBox = useMemo(
    () => createBentoBox(BENTO_DESIGNER_CONFIG.DEFAULT_BENTO_BOX),
    []
  );

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
        console.error(DRAG_DROP_ERRORS.STORAGE_LOAD_FAILED, error);
        setError(getErrorMessage('STORAGE_LOAD_FAILED'));
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
      console.error(DRAG_DROP_ERRORS.CLEAR_FAILED, error);
      setError(getErrorMessage('CLEAR_FAILED'));
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
      setError(getErrorMessage('INGREDIENT_SAVE_FAILED'));
      // Keep modal open so user can retry
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
    startDrag(ingredient);
  };

  const handleDragEnd = (ingredient: Ingredient, position: DragPosition) => {
    updateDragPosition(position);
    // Note: actual drop handling is done in BentoBoxCanvas handleDrop
  };

  const handleSuggestionAdopt = async (suggestion: SuggestionResult) => {
    try {
      // Clear existing placed ingredients
      const newPlacedIngredients = await adoptSuggestions([suggestion]);
      setPlacedIngredients(newPlacedIngredients);
      
      // Save to storage
      await PlacedIngredientService.saveToStorage(newPlacedIngredients);
      
      // Close modal
      closeModal();
    } catch (error) {
      console.error('Failed to adopt suggestion:', error);
      setError(getErrorMessage('SUGGESTION_ADOPT_FAILED'));
      // Keep modal open on error so user can retry
    }
  };

  const handleSuggestionAdoptAll = async (suggestions: SuggestionResult[]) => {
    try {
      // Clear existing placed ingredients and place all suggestions
      const newPlacedIngredients = await adoptSuggestions(suggestions);
      setPlacedIngredients(newPlacedIngredients);
      
      // Save to storage
      await PlacedIngredientService.saveToStorage(newPlacedIngredients);
      
      // Close modal
      closeModal();
    } catch (error) {
      console.error('Failed to adopt suggestions:', error);
      setError(getErrorMessage('SUGGESTION_ADOPT_FAILED'));
      // Keep modal open on error so user can retry
    }
  };

  // Helper function to adopt suggestions and return new placed ingredients
  const adoptSuggestions = async (suggestions: SuggestionResult[]): Promise<PlacedIngredient[]> => {
    const newPlacedIngredients: PlacedIngredient[] = [];
    const partitions = bentoBox.partitions;
    
    if (suggestions.length === 0 || partitions.length === 0) {
      return newPlacedIngredients;
    }
    
    // Placement configuration constants
    const PLACEMENT_CONFIG = {
      STARTING_OFFSET: { x: 10, y: 10 },
      INGREDIENT_SPACING: 5,
      MIN_PARTITION_MARGIN: 5
    };
    
    // Initialize placement positions for each partition
    const partitionPlacements = partitions.map(() => ({ 
      ...PLACEMENT_CONFIG.STARTING_OFFSET 
    }));
    
    for (let i = 0; i < suggestions.length; i++) {
      const suggestion = suggestions[i];
      const partitionIndex = i % partitions.length;
      const partition = partitions[partitionIndex];
      const currentPosition = partitionPlacements[partitionIndex];
      
      // Create placed ingredient with current position
      const placedIngredient = PlacedIngredientService.createPlacedIngredient({
        ingredientId: suggestion.ingredient.id,
        partitionId: partition.id,
        position: { x: currentPosition.x, y: currentPosition.y },
        size: suggestion.ingredient.defaultSize
      });
      
      newPlacedIngredients.push(placedIngredient);
      
      // Calculate next position
      const nextY = currentPosition.y + suggestion.ingredient.defaultSize.height + PLACEMENT_CONFIG.INGREDIENT_SPACING;
      const maxY = partition.bounds.height - PLACEMENT_CONFIG.MIN_PARTITION_MARGIN;
      
      if (nextY + suggestion.ingredient.defaultSize.height <= maxY) {
        // Place next ingredient below current one
        currentPosition.y = nextY;
      } else {
        // Wrap to next column
        currentPosition.x += suggestion.ingredient.defaultSize.width + PLACEMENT_CONFIG.INGREDIENT_SPACING;
        currentPosition.y = PLACEMENT_CONFIG.STARTING_OFFSET.y;
      }
    }
    
    return newPlacedIngredients;
  };

  const handleSuggestionNext = () => {
    // TODO: Implement next suggestion logic
  };

  const handleIngredientDrop = async (ingredient: Ingredient, dropInfo: DropInfo) => {
    try {
      // Validate drop operation
      const validation = validateDrop(
        ingredient,
        dropInfo,
        placedIngredients,
        bentoBox.partitions
      );
      
      if (!validation.isValid) {
        console.warn('Drop validation failed:', validation.error);
        endDrag();
        return;
      }
      
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
      endDrag();
    } catch (error) {
      console.error(DRAG_DROP_ERRORS.PLACEMENT_FAILED, error);
      setError(getErrorMessage('PLACEMENT_FAILED'));
      // Clear drag state even on error
      endDrag();
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
          onAdoptAll={handleSuggestionAdoptAll}
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

      {/* エラーメッセージ */}
      <ErrorMessage 
        error={error}
        onDismiss={clearError}
        autoDismissMs={5000}
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