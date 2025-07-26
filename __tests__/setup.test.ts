import * as fs from 'fs';
import * as path from 'path';

describe('Project Setup', () => {
  it('should have required directory structure', () => {
    const requiredDirs = [
      'src',
      'src/components',
      'src/screens',
      'src/types',
      'src/utils',
      'src/context',
      'src/data'
    ];

    requiredDirs.forEach(dir => {
      const dirPath = path.join(__dirname, '..', dir);
      expect(fs.existsSync(dirPath)).toBe(true);
    });
  });

  it('should have TypeScript configuration', () => {
    const tsconfigPath = path.join(__dirname, '..', 'tsconfig.json');
    expect(fs.existsSync(tsconfigPath)).toBe(true);
  });

  it('should have App entry point', () => {
    const appPath = path.join(__dirname, '..', 'src', 'App.tsx');
    expect(fs.existsSync(appPath)).toBe(true);
  });
});