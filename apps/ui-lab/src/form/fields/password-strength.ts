import type { PasswordStrength } from '@ll-ui/react';

// Returns true if the password contains a block of 3+ consecutive digits that
// ascend or descend by 1 each step (e.g. "123", "987").
const containsSequentialDigits = (value: string): boolean => {
  const blocks = value.match(/\d{3,}/g);
  if (!blocks) return false;
  for (const block of blocks) {
    const digits = block.split('').map(Number);
    let asc = 1;
    let desc = 1;
    for (let i = 1; i < digits.length; i++) {
      const curr = digits[i] as number;
      const prev = digits[i - 1] as number;
      const diff = curr - prev;
      asc = diff === 1 ? asc + 1 : 1;
      desc = diff === -1 ? desc + 1 : 1;
      if (asc >= 3 || desc >= 3) return true;
    }
  }
  return false;
};

// minLength is deliberately required (no default): the meter must agree with
// whatever schema validates the field, so callers thread the schema's real
// minimum through (e.g. MIN_PASSWORD_LENGTH from src/forms/schemas.ts) instead
// of relying on a hardcoded fallback that can drift out of sync.
export const calcPasswordStrength = (value: string, minLength: number): PasswordStrength => {
  if (value.length === 0 || value.length < minLength) return 0;

  const len = value.length;
  const hasAlpha = /[A-Za-z]/.test(value);
  const hasMixedAlpha = /[a-z]/.test(value) && /[A-Z]/.test(value);
  const hasDigits = /\d/.test(value);
  const hasSpecial = /[^A-Za-z0-9]/.test(value);
  const seqDigits = containsSequentialDigits(value);

  // Tiers use the library's 0–5 PasswordStrength scale (1 = very weak … 5 =
  // very strong). This scorer folds "very weak" into "weak", so it never
  // returns 1 — its weakest passing tier reads as Weak on the meter.

  // Very strong: 12+ chars, mixed case, digits, and specials
  if (len >= 12 && hasMixedAlpha && hasDigits && hasSpecial) return 5;

  // Strong: 8+ chars with mixed case + digits + specials, OR 12+ chars with mixed case + digits
  if (len >= 8 && hasMixedAlpha && hasDigits && hasSpecial) return 4;
  if (len >= 12 && hasMixedAlpha && hasDigits) return 4;

  // Medium
  if (len >= 12 && hasAlpha) return 3; // long enough with any alpha (even single case)
  if (len >= 8 && hasMixedAlpha && hasDigits) return 3; // 8+ chars, mixed case + digits
  if (hasAlpha && hasDigits && hasSpecial) return 3; // all three types at any length ≥ minLength
  if (hasAlpha && hasDigits && !seqDigits) return 3; // alpha + non-sequential digits

  return 2;
};
