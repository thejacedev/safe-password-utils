import { checkPasswordStrength } from '../index';

describe('Too Weak Password Strength', () => {
  test('should return "Too weak" for short passwords', () => {
    const result = checkPasswordStrength('abc123');
    expect(result.id).toBe(0);
    expect(result.value).toBe('Too weak');
    expect(result.length).toBe(6);
  });
});
