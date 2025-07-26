import React, { createContext, useContext, ReactNode } from 'react';
import { BentoBox, PlacedIngredient } from '@/types';

export interface BentoState {
  bentoBox: BentoBox | null;
  placedIngredients: PlacedIngredient[];
  selectedCriteria: string[];
}

export interface BentoContextType {
  state: BentoState;
  // Actions will be defined later
}

const BentoContext = createContext<BentoContextType | undefined>(undefined);

export interface BentoProviderProps {
  children: ReactNode;
}

export function BentoProvider({ children }: BentoProviderProps) {
  // Initial state
  const state: BentoState = {
    bentoBox: null,
    placedIngredients: [],
    selectedCriteria: []
  };

  const contextValue: BentoContextType = {
    state
  };

  return (
    <BentoContext.Provider value={contextValue}>
      {children}
    </BentoContext.Provider>
  );
}

export function useBento(): BentoContextType {
  const context = useContext(BentoContext);
  if (context === undefined) {
    throw new Error('useBento must be used within a BentoProvider');
  }
  return context;
}