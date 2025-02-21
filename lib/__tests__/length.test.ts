import { checkPasswordStrength } from '../index';

describe('Password Length', () => {
  test('should return correct length', () => {
    const password = 'TestPassword123!';
    const result = checkPasswordStrength(password);
    expect(result.length).toBe(password.length);
  });
});
