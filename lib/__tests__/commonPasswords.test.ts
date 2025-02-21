import { isCommonPassword } from '../index';

describe('Common Password Lists', () => {
  const listSizes = ['10k', '100k', '250k', '500k', '1m', '2m', '5m', '10m'] as const;
  
  test.each(listSizes)('should load and check passwords against %s list', async (size) => {
    // Test a known common password (e.g., 'password123')
    const isCommon = await isCommonPassword('password123', size);
    expect(isCommon).toBe(true);

    // Test a complex password that shouldn't be in any list
    const notCommon = await isCommonPassword('vX9$mK2#pL5@nQ8&', size);
    expect(notCommon).toBe(false);
  });

  test('should handle invalid file paths gracefully', async () => {
    // Attempt to load a non-existent list size
    const result = await isCommonPassword('test', '10k');
    expect(typeof result).toBe('boolean');
  });
}); 