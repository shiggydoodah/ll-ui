import { describe, expect, it } from 'vitest';

import { MIN_PASSWORD_LENGTH } from '../../forms/schemas';
import { calcPasswordStrength } from './password-strength';

// The scorer takes the schema's minimum explicitly (no default), so the tier
// tests below pin their own minLength and a dedicated block checks alignment
// with the real MIN_PASSWORD_LENGTH the forms thread through.
describe('calcPasswordStrength', () => {
  describe('returns 0 (Too short)', () => {
    it('returns 0 for an empty string', () => {
      expect(calcPasswordStrength('', 6)).toBe(0);
    });

    it('returns 0 for a password shorter than minLength', () => {
      expect(calcPasswordStrength('lotus', 6)).toBe(0);
      expect(calcPasswordStrength('lotus', 8)).toBe(0);
    });

    it('returns non-zero for a password exactly at minLength', () => {
      expect(calcPasswordStrength('abc123', 6)).not.toBe(0);
    });
  });

  describe('returns 2 (Weak)', () => {
    it('lowercase-only repeating word', () => {
      expect(calcPasswordStrength('lotuslotus', 6)).toBe(2);
    });

    it('mixed-case repeating word with no digits', () => {
      expect(calcPasswordStrength('LotusLotus', 6)).toBe(2);
    });

    it('alpha + digits where digits are sequential (123)', () => {
      expect(calcPasswordStrength('lotus123', 6)).toBe(2);
    });

    it('lowercase only at exactly minLength', () => {
      expect(calcPasswordStrength('abcdef', 6)).toBe(2);
    });
  });

  describe('returns 3 (Medium)', () => {
    it('long lowercase-only string (15+ chars)', () => {
      expect(calcPasswordStrength('lotuslotuslotus', 6)).toBe(3);
    });

    it('long mixed-case string with no digits (15+ chars)', () => {
      expect(calcPasswordStrength('LotusLotusLotus', 6)).toBe(3);
    });

    it('alpha + sequential digits + special', () => {
      // "123" is sequential but hasSpecial=true pushes it to medium
      expect(calcPasswordStrength('lotus123!', 6)).toBe(3);
    });

    it('lowercase alpha + non-sequential digits (7 chars)', () => {
      expect(calcPasswordStrength('l0tus12', 6)).toBe(3);
    });

    it('mixed-case alpha + sequential digits at 8 chars', () => {
      // 8 chars, mixed case + digits qualifies for medium even with sequential digits
      expect(calcPasswordStrength('Lotus123', 6)).toBe(3);
    });

    it('mixed-case alpha + non-sequential digits + special at short length', () => {
      expect(calcPasswordStrength('L0tu5!2', 6)).toBe(3);
    });

    it('mixed-case + non-sequential digits at short length', () => {
      expect(calcPasswordStrength('L0tu512', 6)).toBe(3);
    });
  });

  describe('returns 4 (Strong)', () => {
    it('8 chars with mixed case, digits, and specials', () => {
      expect(calcPasswordStrength('L0tu5!2#', 6)).toBe(4);
    });

    it('long string (18 chars) with mixed case and digits', () => {
      expect(calcPasswordStrength('LotusLotusLotus123', 6)).toBe(4);
    });
  });

  describe('returns 5 (Very Strong)', () => {
    it('long string (20 chars) with mixed case, digits, and specials', () => {
      expect(calcPasswordStrength('LotusLotusLotus123!!', 6)).toBe(5);
    });

    it('12+ chars with all character classes', () => {
      expect(calcPasswordStrength('P@ssw0rdL0ng!', 6)).toBe(5);
    });
  });

  describe('sequential digit detection', () => {
    it('treats "123" as sequential (ascending run of 3)', () => {
      expect(calcPasswordStrength('abc123def', 6)).toBe(2);
    });

    it('treats "987" as sequential (descending run of 3)', () => {
      expect(calcPasswordStrength('abc987def', 6)).toBe(2);
    });

    it('does not treat two-digit runs as sequential', () => {
      // "12" is only 2 consecutive digits — not enough to trigger seqDigits
      expect(calcPasswordStrength('abc12def', 6)).toBe(3);
    });

    it('does not treat non-consecutive digit blocks as sequential', () => {
      // digits 0, 1, 2 appear in the string but never as a block of 3
      expect(calcPasswordStrength('l0tus12', 6)).toBe(3);
    });
  });

  describe('alignment with the register schema minimum', () => {
    it('scores 0 for anything the password schema rejects on length', () => {
      // 7 chars would have scored under the old hardcoded minimum of 6, but the
      // schema requires MIN_PASSWORD_LENGTH — the meter must agree.
      expect(calcPasswordStrength('Pa55wd!', MIN_PASSWORD_LENGTH)).toBe(0);
    });

    it('scores non-zero at exactly the schema minimum', () => {
      expect(calcPasswordStrength('Pa55word', MIN_PASSWORD_LENGTH)).not.toBe(0);
    });
  });
});
