export interface PasswordRequirements {
  requireCapital?: boolean;
  requireNumber?: boolean;
  requireSpecial?: boolean;
  minCapitals?: number;
  minNumbers?: number;
  minSpecial?: number;
}

export interface PasswordOption {
  id: 0 | 1 | 2 | 3;
  value: 'Too weak' | 'Weak' | 'Medium' | 'Strong';
  minDiversity: number;
  minLength: number;
}

export const defaultOptions: PasswordOption[] = [
  {
    id: 0,
    value: 'Too weak',
    minDiversity: 0,
    minLength: 0,
  },
  {
    id: 1,
    value: 'Weak',
    minDiversity: 2,
    minLength: 8,
  },
  {
    id: 2,
    value: 'Medium',
    minDiversity: 4,
    minLength: 10,
  },
  {
    id: 3,
    value: 'Strong',
    minDiversity: 4,
    minLength: 12,
  },
];

export interface PasswordStrength {
  id: 0 | 1 | 2 | 3;
  value: 'Too weak' | 'Weak' | 'Medium' | 'Strong';
  contains: {
    lowercase: boolean;
    uppercase: boolean;
    number: boolean;
    symbol: boolean;
  };
  length: number;
  counts?: {
    lowercase: number;
    uppercase: number;
    numbers: number;
    special: number;
  };
}

export function checkPasswordStrength(
  password: string,
  requirements?: PasswordRequirements,
  options: PasswordOption[] = defaultOptions
): PasswordStrength {
  const contains = {
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };

  // Count occurrences if requirements specify minimums
  const counts = {
    lowercase: (password.match(/[a-z]/g) || []).length,
    uppercase: (password.match(/[A-Z]/g) || []).length,
    numbers: (password.match(/[0-9]/g) || []).length,
    special: (password.match(/[^A-Za-z0-9]/g) || []).length,
  };

  const length = password.length;

  // Check if password meets requirements
  if (requirements) {
    const { requireCapital, requireNumber, requireSpecial, minCapitals, minNumbers, minSpecial } =
      requirements;

    if (requireCapital && !contains.uppercase)
      return { id: 0, value: 'Too weak', contains, length };
    if (requireNumber && !contains.number) return { id: 0, value: 'Too weak', contains, length };
    if (requireSpecial && !contains.symbol) return { id: 0, value: 'Too weak', contains, length };

    if (minCapitals && counts.uppercase < minCapitals)
      return { id: 0, value: 'Too weak', contains, length, counts };
    if (minNumbers && counts.numbers < minNumbers)
      return { id: 0, value: 'Too weak', contains, length, counts };
    if (minSpecial && counts.special < minSpecial)
      return { id: 0, value: 'Too weak', contains, length, counts };
  }

  // Count the number of different character types used
  const varietyCount = Object.values(contains).filter(Boolean).length;

  // Find appropriate strength level based on custom options
  let strengthLevel = options.findIndex(
    (opt) => length >= opt.minLength && varietyCount >= opt.minDiversity
  );

  // If no matching level found, use the lowest level
  if (strengthLevel === -1) strengthLevel = 0;

  // Get the highest matching level
  while (
    strengthLevel < options.length - 1 &&
    length >= options[strengthLevel + 1].minLength &&
    varietyCount >= options[strengthLevel + 1].minDiversity
  ) {
    strengthLevel++;
  }

  const { id, value } = options[strengthLevel];

  return {
    id,
    value,
    contains,
    length,
    counts,
  };
}
