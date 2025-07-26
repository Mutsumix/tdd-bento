import React, { createContext, useContext, ReactNode } from 'react';
import { Ingredient } from '@/types';

export interface IngredientsState {
  ingredients: Ingredient[];
  userIngredients: Ingredient[];
}

export interface IngredientsContextType {
  state: IngredientsState;
  // Actions will be defined later
}

const IngredientsContext = createContext<IngredientsContextType | undefined>(undefined);

export interface IngredientsProviderProps {
  children: ReactNode;
}

export function IngredientsProvider({ children }: IngredientsProviderProps) {
  // Initial state
  const state: IngredientsState = {
    ingredients: [],
    userIngredients: []
  };

  const contextValue: IngredientsContextType = {
    state
  };

  return (
    <IngredientsContext.Provider value={contextValue}>
      {children}
    </IngredientsContext.Provider>
  );
}

export function useIngredients(): IngredientsContextType {
  const context = useContext(IngredientsContext);
  if (context === undefined) {
    throw new Error('useIngredients must be used within an IngredientsProvider');
  }
  return context;
}