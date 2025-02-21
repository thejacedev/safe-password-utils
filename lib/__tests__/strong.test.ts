import { checkPasswordStrength } from '../index';

describe('Strong Password Strength', () => {
  test('should return "Strong" for complex passwords', () => {
    const result = checkPasswordStrength('Password123!@#');
    expect(result.id).toBe(3);
    expect(result.value).toBe('Strong');
    expect(result.contains).toEqual({
      lowercase: true,
      uppercase: true,
      number: true,
      symbol: true,
    });
  });
});
