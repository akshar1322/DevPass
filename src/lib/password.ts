export type PasswordCategory = 'email' | 'webapp' | 'mongodb' | 'ssh' | 'api' | 'custom';

export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar?: boolean;
}

const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  number: '0123456789',
  symbol: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  similar: 'il1Lo0O',
};

export const CATEGORY_PRESETS: Record<PasswordCategory, PasswordOptions> = {
  email: {
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  },
  webapp: {
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: false,
  },
  mongodb: {
    length: 24,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: false, // MongoDB passwords often avoid complex symbols in URIs
  },
  ssh: {
    length: 32,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  },
  api: {
    length: 40,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: false,
  },
  custom: {
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  },
};

export function generatePassword(options: PasswordOptions): string {
  let charset = '';
  if (options.includeUppercase) charset += CHARS.upper;
  if (options.includeLowercase) charset += CHARS.lower;
  if (options.includeNumbers) charset += CHARS.number;
  if (options.includeSymbols) charset += CHARS.symbol;

  if (options.excludeSimilar) {
    const similarRegex = new RegExp(`[${CHARS.similar}]`, 'g');
    charset = charset.replace(similarRegex, '');
  }

  if (charset === '' || typeof window === 'undefined') return '';

  let password = '';
  const crypto = window.crypto || (window as any).msCrypto;
  if (!crypto) return '';

  const array = new Uint32Array(options.length);
  crypto.getRandomValues(array);

  for (let i = 0; i < options.length; i++) {
    password += charset.charAt(array[i] % charset.length);
  }

  return password;
}

export function calculateStrength(password: string): number {
  if (!password) return 0;
  let strength = 0;
  if (password.length > 8) strength += 1;
  if (password.length > 12) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  
  // Max strength is 6, normalize to 0-100
  return Math.min(100, Math.round((strength / 6) * 100));
}
