import { useState } from 'react';
import { Ingredient } from '@/types';
import { DragPosition } from '@/components/IngredientList/IngredientItem/IngredientItem';

/**
 * Custom hook for managing drag and drop state
 * Provides centralized state management for drag operations
 */
export function useDragState() {
  const [draggedIngredient, setDraggedIngredient] = useState<Ingredient | undefined>(undefined);
  const [dragPosition, setDragPosition] = useState<DragPosition | undefined>(undefined);

  const startDrag = (ingredient: Ingredient) => {
    setDraggedIngredient(ingredient);
  };

  const updateDragPosition = (position: DragPosition) => {
    setDragPosition(position);
  };

  const endDrag = () => {
    setDraggedIngredient(undefined);
    setDragPosition(undefined);
  };

  const isDragging = draggedIngredient !== undefined;

  return {
    draggedIngredient,
    dragPosition,
    isDragging,
    startDrag,
    updateDragPosition,
    endDrag,
  };
}