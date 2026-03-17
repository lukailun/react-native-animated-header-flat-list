import { getFontSizeFromStyle } from '../styleUtils';

describe('getFontSizeFromStyle', () => {
  it('should return undefined for null style', () => {
    expect(getFontSizeFromStyle(null)).toBeUndefined();
  });

  it('should return undefined for undefined style', () => {
    expect(getFontSizeFromStyle(undefined)).toBeUndefined();
  });

  it('should return fontSize from simple style object', () => {
    const style = { fontSize: 16 };
    expect(getFontSizeFromStyle(style)).toBe(16);
  });

  it('should return fontSize from style array', () => {
    const styles = [
      { color: 'red' },
      { fontSize: 20 },
      { fontWeight: 'bold' as const },
    ];
    expect(getFontSizeFromStyle(styles)).toBe(20);
  });

  it('should return first fontSize found in style array', () => {
    const styles = [{ fontSize: 16 }, { fontSize: 20 }];
    expect(getFontSizeFromStyle(styles)).toBe(20);
  });

  it('should return undefined if no fontSize in style array', () => {
    const styles = [{ color: 'red' }, { fontWeight: 'bold' as const }];
    expect(getFontSizeFromStyle(styles)).toBeUndefined();
  });

  it('should handle empty style array', () => {
    expect(getFontSizeFromStyle([])).toBeUndefined();
  });

  it('should handle style object without fontSize', () => {
    const style = { color: 'blue', fontWeight: 'bold' as const };
    expect(getFontSizeFromStyle(style)).toBeUndefined();
  });
});
