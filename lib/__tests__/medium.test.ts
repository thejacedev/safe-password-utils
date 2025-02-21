import { checkPasswordStrength } from '../index';

describe('Medium Password Strength', () => {
  test('should return "Medium" for better passwords', () => {
    const result = checkPasswordStrength('Pass1!word'); // 10 chars with all types
    expect(result.id).toBe(2);
    expect(result.value).toBe('Medium');
    expect(result.contains).toEqual({
      lowercase: true,
      uppercase: true,
      number: true,
      symbol: true,
    });
  });
});
