import { cn } from './utils';

describe('cn function', () => {
  it('merges class names correctly', () => {
    const result = cn('class1', 'class2');
    expect(result).toContain('class1');
    expect(result).toContain('class2');
  });

  it('filters out invalid class names', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const result = cn('valid-class', 'invalid@class');
    expect(result).toContain('valid-class');
    expect(result).not.toContain('invalid@class');
    expect(consoleWarnSpy).toHaveBeenCalledWith('Invalid class name: invalid@class');
    consoleWarnSpy.mockRestore();
  });

  it('handles empty inputs', () => {
    const result = cn('');
    expect(result).toBe('');
  });
});