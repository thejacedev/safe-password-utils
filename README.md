# 🔒 safe-password-utils

[![CI](https://github.com/thejacedev/safe-password-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/thejacedev/safe-password-utils/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/safepassword-utils.svg)](https://www.npmjs.com/package/safepassword-utils)
[![License: MPL-2.0](https://img.shields.io/badge/License-MPL_2.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)
[![Node.js Version](https://img.shields.io/node/v/safepassword-utils)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)

A secure and flexible password validation utility for TypeScript/JavaScript applications with customizable strength requirements.

## ✨ Features

- 🎯 Accurate password strength assessment
- 🛠️ Customizable validation rules
- 📊 Detailed character analysis
- 💪 Multiple strength levels
- 🔍 Character type detection
- 📝 TypeScript support
- 🧪 Comprehensive test coverage
- 🚫 Common password detection (10k to 10M passwords)
- 🎲 Secure password generation
- 🔢 Password entropy calculation
- ⏱️ Crack time estimation
- 🔍 Pattern detection and analysis
- 🧠 Comprehensive password analysis

## 🚫 Common Password Detection

```typescript
import { isCommonPassword } from 'safepassword-utils';

// Check if a password is commonly used
const isCommon = await isCommonPassword('password123');
console.log(isCommon); // true

// Use different size password lists
const sizes = ['10k', '100k', '250k', '500k', '1m', '2m', '5m', '10m'];
const result = await isCommonPassword('mypassword', '1m'); // Checks against 1 million passwords
```

## 🎲 Password Generation

```typescript
import { generatePassword } from 'safepassword-utils';

// Generate a strong password with default options (16 characters, all character types)
const password = generatePassword();

// Generate a password with custom options
const customPassword = generatePassword({
  length: 20,                    // Custom length
  includeUppercase: true,        // Include uppercase letters
  includeLowercase: true,        // Include lowercase letters
  includeNumbers: true,          // Include numbers
  includeSymbols: true,          // Include special characters
  excludeSimilarCharacters: true,  // Exclude similar characters (i, l, 1, L, o, 0, O)
  excludeAmbiguousCharacters: true // Exclude ambiguous characters ({}, [], (), /\, etc.)
});

// Generate a simple password with only lowercase and numbers
const simplePassword = generatePassword({
  includeUppercase: false,
  includeSymbols: false
});
```

## 🔢 Password Entropy

```typescript
import { calculatePasswordEntropy } from 'safepassword-utils';

// Calculate password entropy
const result = calculatePasswordEntropy('MySecureP@ssw0rd');
console.log(result);
// {
//   entropy: 75.98,        // Entropy in bits
//   poolSize: 95,         // Size of character pool
//   length: 14,          // Password length
//   characterSets: {     // Used character types
//     lowercase: true,
//     uppercase: true,
//     numbers: true,
//     symbols: true
//   }
// }

// Interpreting entropy values:
// < 28 bits   = Very Weak    (may be cracked instantly)
// 28-35 bits  = Weak        (may be cracked in seconds)
// 36-59 bits  = Reasonable  (may take hours to crack)
// 60-127 bits = Strong      (may take years to crack)
// 128+ bits   = Very Strong (practically uncrackable with current technology)
```

## ⏱️ Crack Time Estimation

```typescript
import { estimateCrackTime } from 'safepassword-utils';

// Estimate how long it would take to crack a password
const result = estimateCrackTime('MySecureP@ssw0rd');
console.log(result);
// {
//   // Raw time estimates in seconds
//   onlineThrottling100PerHour: 1.2e24,
//   onlineNoThrottling10PerSecond: 3.4e20,
//   offlineSlowHashing1e4PerSecond: 3.4e16,
//   offlineFastHashing1e10PerSecond: 3.4e10,
//   
//   // Human readable estimates
//   timeToCrack: {
//     onlineThrottling: 'centuries',          // Online attack, limited to 100 attempts per hour
//     onlineNoThrottling: '108 years',        // Online attack, 10 attempts per second
//     offlineSlowHashing: '13 months',        // Offline attack, 10k attempts per second
//     offlineFastHashing: '4 days'           // Offline attack, 10B attempts per second
//   }
// }

// Different attack scenarios:
// 1. Online throttled: Simulates a login form with rate limiting (100 attempts/hour)
// 2. Online no throttling: Simulates unprotected online system (10 attempts/second)
// 3. Offline slow hash: Offline attack with slow hash function (10k attempts/second)
// 4. Offline fast hash: Offline attack with fast hash function (10B attempts/second)
```

## 🔍 Password Pattern Analysis

```typescript
import { analyzePasswordPatterns } from 'safepassword-utils';

// Analyze a password for common patterns
const analysis = analyzePasswordPatterns('qwerty123');
console.log(analysis);
// {
//   hasKeyboardPattern: true,
//   hasSequentialChars: false,
//   hasRepeatedChars: false,
//   hasDatePattern: false,
//   patternRiskScore: 30,
//   detectedPatterns: ['Keyboard pattern: "qwerty"'],
//   suggestions: ['Avoid keyboard patterns like "qwerty" or "asdfgh"']
// }

// Analyze a password with multiple patterns
const complexAnalysis = analyzePasswordPatterns('abc123456');
console.log(complexAnalysis);
// {
//   hasKeyboardPattern: false,
//   hasSequentialChars: true,
//   hasRepeatedChars: false,
//   hasDatePattern: false,
//   patternRiskScore: 25,
//   detectedPatterns: ['Sequential letters: "abc"', 'Sequential numbers: "123"'],
//   suggestions: ['Avoid sequential characters like "abc" or "123"']
// }
```

## 🧠 Comprehensive Password Analysis

```typescript
import { analyzePassword } from 'safepassword-utils';

// Get a complete analysis of a password
const fullAnalysis = analyzePassword('Password123!');
console.log(fullAnalysis);
// {
//   // Strength assessment
//   strength: {
//     id: 2,
//     value: 'Medium',
//     contains: { lowercase: true, uppercase: true, number: true, symbol: true },
//     length: 12,
//     counts: { lowercase: 7, uppercase: 1, numbers: 3, special: 1 }
//   },
//   // Entropy calculation
//   entropy: {
//     entropy: 70.24,
//     poolSize: 95,
//     length: 12,
//     characterSets: { lowercase: true, uppercase: true, numbers: true, symbols: true }
//   },
//   // Crack time estimation
//   crackTime: {
//     onlineThrottling100PerHour: 3.8e21,
//     onlineNoThrottling10PerSecond: 1.1e18,
//     offlineSlowHashing1e4PerSecond: 1.1e14,
//     offlineFastHashing1e10PerSecond: 1.1e8,
//     timeToCrack: {
//       onlineThrottling: 'centuries',
//       onlineNoThrottling: 'centuries',
//       offlineSlowHashing: '3 years',
//       offlineFastHashing: '3 days'
//     }
//   },
//   // Pattern analysis
//   patterns: {
//     hasKeyboardPattern: false,
//     hasSequentialChars: false,
//     hasRepeatedChars: false,
//     hasDatePattern: false,
//     patternRiskScore: 0,
//     detectedPatterns: [],
//     suggestions: []
//   }
// }
```

## 📦 Installation

```bash
npm install safepassword-utils
# or
yarn add safepassword-utils
# or
pnpm add safepassword-utils
```

## 🚀 Quick Start

```typescript
import { checkPasswordStrength } from 'safepassword-utils';

// Basic usage
const result = checkPasswordStrength('MyPassword123!');
console.log(result);
// {
//   id: 3,
//   value: 'Strong',
//   contains: {
//     lowercase: true,
//     uppercase: true,
//     number: true,
//     symbol: true
//   },
//   length: 13,
//   counts: {
//     lowercase: 7,
//     uppercase: 2,
//     numbers: 3,
//     special: 1
//   }
// }
```

## 🛠️ Advanced Usage

### Custom Requirements

```typescript
import { checkPasswordStrength } from 'safepassword-utils';

const requirements = {
  requireCapital: true,
  requireNumber: true,
  requireSpecial: true,
  minCapitals: 2,
  minNumbers: 2,
  minSpecial: 1
};

const result = checkPasswordStrength('MyPass12!', requirements);
```

### Custom Strength Options

```typescript
import { checkPasswordStrength } from 'safepassword-utils';

const customOptions = [
  {
    id: 0,
    value: "Too weak",
    minDiversity: 0,
    minLength: 0
  },
  {
    id: 1,
    value: "Weak",
    minDiversity: 2,
    minLength: 6
  },
  {
    id: 2,
    value: "Medium",
    minDiversity: 3,
    minLength: 8
  },
  {
    id: 3,
    value: "Strong",
    minDiversity: 4,
    minLength: 10
  }
];

const result = checkPasswordStrength('MyPassword1!', undefined, customOptions);
```

## 📊 Return Examples

### Too Weak Password
```typescript
checkPasswordStrength('abc');
{
  id: 0,
  value: 'Too weak',
  contains: {
    lowercase: true,
    uppercase: false,
    number: false,
    symbol: false
  },
  length: 3,
  counts: {
    lowercase: 3,
    uppercase: 0,
    numbers: 0,
    special: 0
  }
}
```

### Weak Password
```typescript
checkPasswordStrength('password123');
{
  id: 1,
  value: 'Weak',
  contains: {
    lowercase: true,
    uppercase: false,
    number: true,
    symbol: false
  },
  length: 11,
  counts: {
    lowercase: 8,
    uppercase: 0,
    numbers: 3,
    special: 0
  }
}
```

### Medium Password
```typescript
checkPasswordStrength('Pass1!word');
{
  id: 2,
  value: 'Medium',
  contains: {
    lowercase: true,
    uppercase: true,
    number: true,
    symbol: true
  },
  length: 10,
  counts: {
    lowercase: 5,
    uppercase: 1,
    numbers: 1,
    special: 1
  }
}
```

### Strong Password
```typescript
checkPasswordStrength('MySecureP@ss123');
{
  id: 3,
  value: 'Strong',
  contains: {
    lowercase: true,
    uppercase: true,
    number: true,
    symbol: true
  },
  length: 15,
  counts: {
    lowercase: 8,
    uppercase: 3,
    numbers: 3,
    special: 1
  }
}
```

### With Custom Requirements (Failed)
```typescript
checkPasswordStrength('password123', { requireSpecial: true });
{
  id: 0,
  value: 'Too weak',
  contains: {
    lowercase: true,
    uppercase: false,
    number: true,
    symbol: false
  },
  length: 11,
  counts: {
    lowercase: 8,
    uppercase: 0,
    numbers: 3,
    special: 0
  }
}
```

### With Custom Requirements (Passed)
```typescript
checkPasswordStrength('MyP@ss123!', {
  requireCapital: true,
  requireSpecial: true,
  minSpecial: 2
});
{
  id: 2,
  value: 'Medium',
  contains: {
    lowercase: true,
    uppercase: true,
    number: true,
    symbol: true
  },
  length: 10,
  counts: {
    lowercase: 3,
    uppercase: 2,
    numbers: 3,
    special: 2
  }
}
```

## 📋 API Reference

### `checkPasswordStrength(password, requirements?, options?)`

Analyzes password strength based on length, character diversity, and custom requirements.

#### Parameters

- `password: string` - The password to analyze
- `requirements?: PasswordRequirements` - Optional custom requirements
  - `requireCapital?: boolean` - Require capital letters
  - `requireNumber?: boolean` - Require numbers
  - `requireSpecial?: boolean` - Require special characters
  - `minCapitals?: number` - Minimum number of capital letters
  - `minNumbers?: number` - Minimum number of numbers
  - `minSpecial?: number` - Minimum number of special characters
- `options?: PasswordOption[]` - Custom strength level options

### `generatePassword(options?)`

Generates a secure random password with customizable options.

#### Parameters

- `options?: PasswordGenerationOptions` - Optional generation settings
  - `length?: number` - Password length (default: 16)
  - `includeUppercase?: boolean` - Include uppercase letters (default: true)
  - `includeLowercase?: boolean` - Include lowercase letters (default: true)
  - `includeNumbers?: boolean` - Include numbers (default: true)
  - `includeSymbols?: boolean` - Include special characters (default: true)
  - `excludeSimilarCharacters?: boolean` - Exclude similar characters like i, l, 1, O, 0 (default: false)
  - `excludeAmbiguousCharacters?: boolean` - Exclude ambiguous characters like {}, [], () (default: false)

#### Default Strength Levels

| Level    | Min Length | Min Diversity | Description                    |
|----------|------------|---------------|--------------------------------|
| Too weak | 0         | 0            | Fails minimum requirements     |
| Weak     | 8         | 2            | Basic requirements met         |
| Medium   | 10        | 4            | Good password strength         |
| Strong   | 12        | 4            | Excellent password strength    |

### `calculatePasswordEntropy(password)`

Calculates the entropy (randomness) of a password in bits.

#### Parameters

- `password: string` - The password to analyze

#### Returns

- `EntropyDetails` object containing:
  - `entropy: number` - Entropy value in bits
  - `poolSize: number` - Size of the character pool
  - `length: number` - Password length
  - `characterSets: object` - Used character types
    - `lowercase: boolean`
    - `uppercase: boolean`
    - `numbers: boolean`
    - `symbols: boolean`

### `estimateCrackTime(password)`

Estimates the time required to crack a password under different attack scenarios.

#### Parameters

- `password: string` - The password to analyze

#### Returns

- `CrackTimeEstimates` object containing:
  - Raw time estimates (in seconds):
    - `onlineThrottling100PerHour: number`
    - `onlineNoThrottling10PerSecond: number`
    - `offlineSlowHashing1e4PerSecond: number`
    - `offlineFastHashing1e10PerSecond: number`
  - Human readable estimates:
    - `timeToCrack: object`
      - `onlineThrottling: string`
      - `onlineNoThrottling: string`
      - `offlineSlowHashing: string`
      - `offlineFastHashing: string`

### `analyzePasswordPatterns(password)`

Analyzes a password for common patterns that might make it vulnerable to guessing or dictionary attacks.

#### Parameters

- `password: string` - The password to analyze

#### Returns

- `PasswordPatternAnalysis` object containing:
  - `hasKeyboardPattern: boolean` - Whether the password contains keyboard patterns (e.g., 'qwerty')
  - `hasSequentialChars: boolean` - Whether the password contains sequential characters (e.g., 'abc', '123')
  - `hasRepeatedChars: boolean` - Whether the password contains repeated characters (e.g., 'aaa', '111')
  - `hasDatePattern: boolean` - Whether the password contains date patterns (e.g., '1990', '2023')
  - `patternRiskScore: number` - Overall risk score from 0 (no patterns) to 100 (highly patterned)
  - `detectedPatterns: string[]` - Specific patterns detected in the password
  - `suggestions: string[]` - Suggestions to improve the password

### `analyzePassword(password)`

Provides a comprehensive analysis of a password by combining strength checking, entropy calculation, crack time estimation, and pattern detection.

#### Parameters

- `password: string` - The password to analyze

#### Returns

- A comprehensive object containing:
  - `strength: PasswordStrength` - Password strength assessment
  - `entropy: EntropyDetails` - Entropy calculation
  - `crackTime: CrackTimeEstimates` - Crack time estimation
  - `patterns: PasswordPatternAnalysis` - Pattern analysis

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the Mozilla Public License Version 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with TypeScript
- Tested with Jest
- Maintained by [Jace Sleeman](https://github.com/thejacedev)

---

<p align="center">Made with ❤️ for the open source community</p> 