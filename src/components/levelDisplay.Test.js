import { levelDisplay } from './your-file-name'; // Replace with the actual file path

describe('levelDisplay', () => {
  it('should return "Starter" for level 1', () => {
    expect(levelDisplay(1)).toBe('Starter');
  });

  it('should return "Intermediate" for level 2', () => {
    expect(levelDisplay(2)).toBe('Intermediate');
  });

  it('should return "Advanced" for level 3', () => {
    expect(levelDisplay(3)).toBe('Advanced');
  });

  it('should return "Standard" for any other level', () => {
    expect(levelDisplay(0)).toBe('Standard');
    expect(levelDisplay(4)).toBe('Standard');
    expect(levelDisplay(-1)).toBe('Standard');
  });
});

