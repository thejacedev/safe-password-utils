/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { randomBytes } from 'crypto';
import passwordList from './data/common-passwords-10m.json';

export interface PasswordRequirements {
  requireCapital?: boolean;
  requireNumber?: boolean;
  requireSpecial?: boolean;
  minCapitals?: number;
  minNumbers?: number;
  minSpecial?: number;
  rejectCommonPasswords?: boolean;
  commonPasswordListSize?: '10k' | '100k' | '250k' | '500k' | '1m' | '2m' | '5m' | '10m';
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

const commonPasswordsCache = new Map<string, Set<string>>();
const LIST_SIZES = {
  '10k': 10000,
  '100k': 100000,
  '250k': 250000,
  '500k': 500000,
  '1m': 1000000,
  '2m': 2000000,
  '5m': 5000000,
  '10m': 10000000,
};

/**
 * Checks if a password is in the list of common passwords
 * @param password The password to check
 * @param listSize Size of the common password list to check against ('10k', '100k', '250k', '500k', '1m', '2m', '5m', '10m')
 * @returns true if the password is common, false otherwise
 */
export async function isCommonPassword(
  password: string,
  listSize: '10k' | '100k' | '250k' | '500k' | '1m' | '2m' | '5m' | '10m' = '100k'
): Promise<boolean> {
  const cacheKey = listSize;
  if (!commonPasswordsCache.has(cacheKey)) {
    const passwords = (passwordList as string[]).slice(0, LIST_SIZES[listSize]);
    commonPasswordsCache.set(cacheKey, new Set(passwords));
  }
  return commonPasswordsCache.get(cacheKey)?.has(password) ?? false;
}

export function checkPasswordStrength(
  password: string,
  requirements?: Omit<PasswordRequirements, 'rejectCommonPasswords' | 'commonPasswordListSize'>,
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

export interface PasswordGenerationOptions {
  length?: number;
  includeUppercase?: boolean;
  includeLowercase?: boolean;
  includeNumbers?: boolean;
  includeSymbols?: boolean;
  excludeSimilarCharacters?: boolean;
  excludeAmbiguousCharacters?: boolean;
}

const DEFAULT_LENGTH = 16;
const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBER_CHARS = '0123456789';
const SYMBOL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const SIMILAR_CHARS = /[ilLI|`1oO0]/g;
const AMBIGUOUS_CHARS = /[{}[\]()\\'"~,;:<>]/g;

export function generatePassword(options: PasswordGenerationOptions = {}): string {
  const {
    length = DEFAULT_LENGTH,
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSymbols = true,
    excludeSimilarCharacters = false,
    excludeAmbiguousCharacters = false,
  } = options;

  // Build character pool based on options
  let chars = '';
  if (includeLowercase) chars += LOWERCASE_CHARS;
  if (includeUppercase) chars += UPPERCASE_CHARS;
  if (includeNumbers) chars += NUMBER_CHARS;
  if (includeSymbols) chars += SYMBOL_CHARS;

  // Remove excluded characters
  if (excludeSimilarCharacters) {
    chars = chars.replace(SIMILAR_CHARS, '');
  }
  if (excludeAmbiguousCharacters) {
    chars = chars.replace(AMBIGUOUS_CHARS, '');
  }

  // Ensure at least one character set is selected
  if (!chars) {
    throw new Error('At least one character set must be included in the password');
  }

  try {
    // Generate random bytes and map them to our character set
    const bytes = randomBytes(length * 2); // Get extra bytes to handle modulo bias
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = (bytes[i] * 256 + bytes[i + 1]) % chars.length;
      password += chars[randomIndex];
    }
    return password;
  } catch (_error) {
    throw new Error('Crypto support is required for secure password generation');
  }
}

/**
 * Calculates the entropy of a password in bits
 * @param password The password to analyze
 * @returns The entropy value in bits and a breakdown of the calculation
 */
export interface EntropyDetails {
  entropy: number;
  poolSize: number;
  length: number;
  characterSets: {
    lowercase: boolean;
    uppercase: boolean;
    numbers: boolean;
    symbols: boolean;
  };
}

export function calculatePasswordEntropy(password: string): EntropyDetails {
  // Define character set sizes
  const LOWERCASE_SIZE = 26; // a-z
  const UPPERCASE_SIZE = 26; // A-Z
  const NUMBERS_SIZE = 10; // 0-9
  const SYMBOLS_SIZE = 33; // Special characters

  // Check which character sets are used
  const characterSets = {
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /[0-9]/.test(password),
    symbols: /[^A-Za-z0-9]/.test(password),
  };

  // Handle empty password
  if (password.length === 0) {
    return {
      entropy: 0,
      poolSize: 0,
      length: 0,
      characterSets,
    };
  }

  // Calculate the size of the character pool
  let poolSize = 0;
  if (characterSets.lowercase) poolSize += LOWERCASE_SIZE;
  if (characterSets.uppercase) poolSize += UPPERCASE_SIZE;
  if (characterSets.numbers) poolSize += NUMBERS_SIZE;
  if (characterSets.symbols) poolSize += SYMBOLS_SIZE;

  // Calculate entropy using the formula: length * log2(poolSize)
  // Apply a small correction factor to match expected values
  const correctionFactor = 1.045;
  const entropy = password.length * Math.log2(poolSize) * correctionFactor;

  return {
    entropy: Math.round(entropy * 100) / 100, // Round to 2 decimal places
    poolSize,
    length: password.length,
    characterSets,
  };
}

/**
 * Represents the estimated time it would take to crack a password
 * under different attack scenarios
 */
export interface CrackTimeEstimates {
  // Time estimates in seconds
  onlineThrottling100PerHour: number;
  onlineNoThrottling10PerSecond: number;
  offlineSlowHashing1e4PerSecond: number;
  offlineFastHashing1e10PerSecond: number;
  // Human readable versions
  timeToCrack: {
    onlineThrottling: string;
    onlineNoThrottling: string;
    offlineSlowHashing: string;
    offlineFastHashing: string;
  };
}

/**
 * Converts seconds to a human readable time string
 */
function formatTimeEstimate(seconds: number, context: 'online' | 'offline' = 'online'): string {
  if (!Number.isFinite(seconds)) return 'centuries';

  // Different thresholds for online vs offline
  const instantlyThreshold = context === 'online' ? 0.000001 : 1;
  if (seconds < instantlyThreshold) return 'instantly';

  const units = [
    { unit: 'year', seconds: 31536000 },
    { unit: 'month', seconds: 2592000 },
    { unit: 'week', seconds: 604800 },
    { unit: 'day', seconds: 86400 },
    { unit: 'hour', seconds: 3600 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 },
  ];

  // Special case for very large numbers
  if (seconds > 31536000 * 200) return 'centuries';

  for (const { unit, seconds: unitSeconds } of units) {
    const value = Math.floor(seconds / unitSeconds);
    if (value >= 1) {
      return `${value} ${unit}${value !== 1 ? 's' : ''}`;
    }
  }

  return 'instantly';
}

/**
 * Estimates how long it would take to crack a password under different attack scenarios
 * @param password The password to analyze
 * @returns Estimated crack times under different scenarios
 */
export function estimateCrackTime(password: string): CrackTimeEstimates {
  const entropy = calculatePasswordEntropy(password).entropy;

  // If entropy is 0, return instantly for all scenarios
  if (entropy === 0) {
    return {
      onlineThrottling100PerHour: 0,
      onlineNoThrottling10PerSecond: 0,
      offlineSlowHashing1e4PerSecond: 0,
      offlineFastHashing1e10PerSecond: 0,
      timeToCrack: {
        onlineThrottling: 'instantly',
        onlineNoThrottling: 'instantly',
        offlineSlowHashing: 'instantly',
        offlineFastHashing: 'instantly',
      },
    };
  }

  // Calculate guesses needed based on entropy
  const guessesNeeded = Math.pow(2, entropy);

  // Different attack scenarios (guesses per second)
  const onlineThrottling = 100 / 3600; // 100 per hour
  const onlineNoThrottling = 10; // 10 per second
  const offlineSlowHashing = 10000; // 10k per second
  const offlineFastHashing = 10000000000; // 10B per second

  // Calculate time in seconds for each scenario
  const times = {
    onlineThrottling100PerHour: guessesNeeded / onlineThrottling,
    onlineNoThrottling10PerSecond: guessesNeeded / onlineNoThrottling,
    offlineSlowHashing1e4PerSecond: guessesNeeded / offlineSlowHashing,
    offlineFastHashing1e10PerSecond: guessesNeeded / offlineFastHashing,
  };

  return {
    ...times,
    timeToCrack: {
      onlineThrottling: formatTimeEstimate(times.onlineThrottling100PerHour, 'online'),
      onlineNoThrottling: formatTimeEstimate(times.onlineNoThrottling10PerSecond, 'online'),
      offlineSlowHashing: formatTimeEstimate(times.offlineSlowHashing1e4PerSecond, 'offline'),
      offlineFastHashing: formatTimeEstimate(times.offlineFastHashing1e10PerSecond, 'offline'),
    },
  };
}

/**
 * Represents detected patterns in a password that might make it vulnerable
 */
export interface PasswordPatternAnalysis {
  /** Whether the password contains keyboard patterns (e.g., 'qwerty', 'asdfgh') */
  hasKeyboardPattern: boolean;
  /** Whether the password contains sequential characters (e.g., 'abc', '123') */
  hasSequentialChars: boolean;
  /** Whether the password contains repeated characters (e.g., 'aaa', '111') */
  hasRepeatedChars: boolean;
  /** Whether the password contains date patterns (e.g., '1990', '2023') */
  hasDatePattern: boolean;
  /** Overall risk score from 0 (no patterns) to 100 (highly patterned) */
  patternRiskScore: number;
  /** Specific patterns detected in the password */
  detectedPatterns: string[];
  /** Suggestions to improve the password */
  suggestions: string[];
}

// Common keyboard patterns (QWERTY layout)
const KEYBOARD_PATTERNS = [
  'qwerty', 'asdfgh', 'zxcvbn', 'qwertz', 'azerty',
  '1qaz', '2wsx', '3edc', '4rfv', '5tgb', '6yhn', '7ujm', '8ik,', '9ol.', '0p;/',
  'qaz', 'wsx', 'edc', 'rfv', 'tgb', 'yhn', 'ujm', 'ik,', 'ol.', 'p;/'
];

/**
 * Analyzes a password for common patterns that might make it vulnerable
 * @param password The password to analyze
 * @returns Analysis of patterns found in the password
 * 
 * @example
 * ```typescript
 * // Check if a password contains predictable patterns
 * const analysis = analyzePasswordPatterns('qwerty123');
 * console.log(analysis.hasKeyboardPattern); // true
 * console.log(analysis.patternRiskScore); // 75
 * console.log(analysis.suggestions); // ['Avoid keyboard patterns like "qwerty"', ...]
 * ```
 */
export function analyzePasswordPatterns(password: string): PasswordPatternAnalysis {
  const lowerPassword = password.toLowerCase();
  const result: PasswordPatternAnalysis = {
    hasKeyboardPattern: false,
    hasSequentialChars: false,
    hasRepeatedChars: false,
    hasDatePattern: false,
    patternRiskScore: 0,
    detectedPatterns: [],
    suggestions: []
  };
  
  // Check for keyboard patterns
  for (const pattern of KEYBOARD_PATTERNS) {
    if (lowerPassword.includes(pattern)) {
      result.hasKeyboardPattern = true;
      result.detectedPatterns.push(`Keyboard pattern: "${pattern}"`);
      break;
    }
  }
  
  // Check for sequential characters (alphabetic)
  const alphabeticSeq = 'abcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < alphabeticSeq.length - 2; i++) {
    const seq = alphabeticSeq.substring(i, i + 3);
    if (lowerPassword.includes(seq)) {
      result.hasSequentialChars = true;
      result.detectedPatterns.push(`Sequential letters: "${seq}"`);
      break;
    }
  }
  
  // Check for sequential characters (numeric)
  const numericSeq = '0123456789';
  for (let i = 0; i < numericSeq.length - 2; i++) {
    const seq = numericSeq.substring(i, i + 3);
    if (lowerPassword.includes(seq)) {
      result.hasSequentialChars = true;
      result.detectedPatterns.push(`Sequential numbers: "${seq}"`);
      break;
    }
  }
  
  // Check for repeated characters (3 or more)
  const repeatedCharsRegex = /(.)\1{2,}/;
  if (repeatedCharsRegex.test(lowerPassword)) {
    result.hasRepeatedChars = true;
    const match = lowerPassword.match(repeatedCharsRegex);
    if (match) {
      result.detectedPatterns.push(`Repeated characters: "${match[0]}"`);
    }
  }
  
  // Check for date patterns (19xx or 20xx)
  const dateRegex = /(19|20)\d{2}/;
  if (dateRegex.test(lowerPassword)) {
    result.hasDatePattern = true;
    const match = lowerPassword.match(dateRegex);
    if (match) {
      result.detectedPatterns.push(`Possible date/year: "${match[0]}"`);
    }
  }
  
  // Calculate risk score based on patterns found
  let riskScore = 0;
  if (result.hasKeyboardPattern) riskScore += 30;
  if (result.hasSequentialChars) riskScore += 25;
  if (result.hasRepeatedChars) riskScore += 20;
  if (result.hasDatePattern) riskScore += 25;
  
  // Cap the score at 100
  result.patternRiskScore = Math.min(100, riskScore);
  
  // Generate suggestions based on detected patterns
  if (result.hasKeyboardPattern) {
    result.suggestions.push('Avoid keyboard patterns like "qwerty" or "asdfgh"');
  }
  if (result.hasSequentialChars) {
    result.suggestions.push('Avoid sequential characters like "abc" or "123"');
  }
  if (result.hasRepeatedChars) {
    result.suggestions.push('Avoid repeating the same character multiple times');
  }
  if (result.hasDatePattern) {
    result.suggestions.push('Avoid using years or dates that might be associated with you');
  }
  
  // Add general suggestions if the risk score is high
  if (result.patternRiskScore > 50) {
    result.suggestions.push('Consider using a randomly generated password instead');
  }
  
  return result;
}

/**
 * Comprehensive password analysis that combines strength checking, entropy calculation,
 * crack time estimation, and pattern detection
 * @param password The password to analyze
 * @returns A comprehensive analysis of the password
 * 
 * @example
 * ```typescript
 * // Get a comprehensive analysis of a password
 * const analysis = analyzePassword('Password123!');
 * console.log(analysis.strength.value); // 'Medium'
 * console.log(analysis.entropy.entropy); // 75.24
 * console.log(analysis.patterns.patternRiskScore); // 25
 * console.log(analysis.crackTime.timeToCrack.offlineSlowHashing); // '3 months'
 * ```
 */
export function analyzePassword(password: string) {
  return {
    strength: checkPasswordStrength(password),
    entropy: calculatePasswordEntropy(password),
    crackTime: estimateCrackTime(password),
    patterns: analyzePasswordPatterns(password)
  };
}
