# 🔒 safe-password-utils

[![CI](https://github.com/TheRealPerson98/safe-password-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/TheRealPerson98/safe-password-utils/actions/workflows/ci.yml)
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

## 🚫 Common Password Detection

```typescript
import { isCommonPassword } from 'safe-password-utils';

// Check if a password is commonly used
const isCommon = await isCommonPassword('password123');
console.log(isCommon); // true

// Use different size password lists
const sizes = ['10k', '100k', '250k', '500k', '1m', '2m', '5m', '10m'];
const result = await isCommonPassword('mypassword', '1m'); // Checks against 1 million passwords
```

## 📦 Installation

```bash
npm i safepassword-utils
# or
yarn add safepassword-utils
# or
pnpm add safepassword-utils
```

## 🚀 Quick Start

```typescript
import { checkPasswordStrength } from 'safe-password-utils';

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

#### Default Strength Levels

| Level    | Min Length | Min Diversity | Description                    |
|----------|------------|---------------|--------------------------------|
| Too weak | 0         | 0            | Fails minimum requirements     |
| Weak     | 8         | 2            | Basic requirements met         |
| Medium   | 10        | 4            | Good password strength         |
| Strong   | 12        | 4            | Excellent password strength    |

#### Returns

```typescript
interface PasswordStrength {
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
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the Mozilla Public License Version 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with TypeScript
- Tested with Jest
- Maintained by [Jace Sleeman](https://github.com/TheRealPerson98)

---

<p align="center">Made with ❤️ for the open source community</p> 