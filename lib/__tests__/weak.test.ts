import { checkPasswordStrength } from '../index';

describe('Weak Password Strength', () => {
  test('should return "Weak" for simple passwords', () => {
    const result = checkPasswordStrength('password123');
    expect(result.id).toBe(1);
    expect(result.value).toBe('Weak');
    expect(result.contains).toEqual({
      lowercase: true,
      uppercase: false,
      number: true,
      symbol: false,
    });
  });
});
