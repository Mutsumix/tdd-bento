import { existsSync } from 'fs';
import path from 'path';

describe('Project Structure', () => {
  const srcPath = path.join(__dirname, '../../src');
  
  describe('Component directories', () => {
    it('should have components directory', () => {
      expect(existsSync(path.join(srcPath, 'components'))).toBe(true);
    });

    it('should have main screen components', () => {
      const componentsPath = path.join(srcPath, 'components');
      expect(existsSync(path.join(componentsPath, 'BentoDesigner'))).toBe(true);
      expect(existsSync(path.join(componentsPath, 'BentoBoxCanvas'))).toBe(true);
      expect(existsSync(path.join(componentsPath, 'IngredientList'))).toBe(true);
      expect(existsSync(path.join(componentsPath, 'ActionBar'))).toBe(true);
    });

    it('should have modal components', () => {
      const componentsPath = path.join(srcPath, 'components');
      expect(existsSync(path.join(componentsPath, 'SuggestionModal'))).toBe(true);
      expect(existsSync(path.join(componentsPath, 'AddIngredientModal'))).toBe(true);
    });

    it('should have sub-components', () => {
      const componentsPath = path.join(srcPath, 'components');
      expect(existsSync(path.join(componentsPath, 'BentoBoxCanvas', 'PartitionArea'))).toBe(true);
      expect(existsSync(path.join(componentsPath, 'BentoBoxCanvas', 'PlacedIngredientItem'))).toBe(true);
      expect(existsSync(path.join(componentsPath, 'IngredientList', 'IngredientItem'))).toBe(true);
      expect(existsSync(path.join(componentsPath, 'SuggestionModal', 'CriteriaSelector'))).toBe(true);
      expect(existsSync(path.join(componentsPath, 'SuggestionModal', 'SuggestionDisplay'))).toBe(true);
    });
  });

  describe('Context providers', () => {
    it('should have context directory', () => {
      expect(existsSync(path.join(srcPath, 'context'))).toBe(true);
    });

    it('should have BentoContext', () => {
      expect(existsSync(path.join(srcPath, 'context', 'BentoContext.tsx'))).toBe(true);
    });

    it('should have IngredientsContext', () => {
      expect(existsSync(path.join(srcPath, 'context', 'IngredientsContext.tsx'))).toBe(true);
    });
  });

  describe('Component index files', () => {
    it('should have main components index file', () => {
      expect(existsSync(path.join(srcPath, 'components', 'index.ts'))).toBe(true);
    });

    it('should have BentoDesigner index file', () => {
      expect(existsSync(path.join(srcPath, 'components', 'BentoDesigner', 'index.ts'))).toBe(true);
    });

    it('should have BentoBoxCanvas index file', () => {
      expect(existsSync(path.join(srcPath, 'components', 'BentoBoxCanvas', 'index.ts'))).toBe(true);
    });
  });
});

describe('Component exports', () => {
  it('should export BentoDesigner component', async () => {
    const { BentoDesigner } = await import('@/components/BentoDesigner');
    expect(BentoDesigner).toBeDefined();
    expect(typeof BentoDesigner).toBe('function');
  });

  it('should export BentoBoxCanvas component', async () => {
    const { BentoBoxCanvas } = await import('@/components/BentoBoxCanvas');
    expect(BentoBoxCanvas).toBeDefined();
    expect(typeof BentoBoxCanvas).toBe('function');
  });

  it('should export IngredientList component', async () => {
    const { IngredientList } = await import('@/components/IngredientList');
    expect(IngredientList).toBeDefined();
    expect(typeof IngredientList).toBe('function');
  });

  it('should export ActionBar component', async () => {
    const { ActionBar } = await import('@/components/ActionBar');
    expect(ActionBar).toBeDefined();
    expect(typeof ActionBar).toBe('function');
  });

  it('should export SuggestionModal component', async () => {
    const { SuggestionModal } = await import('@/components/SuggestionModal');
    expect(SuggestionModal).toBeDefined();
    expect(typeof SuggestionModal).toBe('function');
  });

  it('should export context providers', async () => {
    const { BentoProvider, useBento } = await import('@/context/BentoContext');
    const { IngredientsProvider, useIngredients } = await import('@/context/IngredientsContext');
    
    expect(BentoProvider).toBeDefined();
    expect(useBento).toBeDefined();
    expect(IngredientsProvider).toBeDefined();
    expect(useIngredients).toBeDefined();
  });
});