import { checkPasswordStrength } from '../index';

describe('Password Character Types', () => {
  test('should correctly identify character types', () => {
    const result = checkPasswordStrength('aA1!');
    expect(result.contains).toEqual({
      lowercase: true,
      uppercase: true,
      number: true,
      symbol: true,
    });
  });
});
