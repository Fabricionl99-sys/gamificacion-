import { describe, expect, it } from 'vitest';

import {
  formatExpiryLabel,
  parseSafeDate,
  safeFormatDate,
  safeFormatRelativeTime,
  safeFormatTimeRemaining,
} from './date';

describe('parseSafeDate', () => {
  it('returns null for empty and invalid values', () => {
    expect(parseSafeDate(null)).toBeNull();
    expect(parseSafeDate(undefined)).toBeNull();
    expect(parseSafeDate('')).toBeNull();
    expect(parseSafeDate('not-a-date')).toBeNull();
  });

  it('parses valid ISO strings', () => {
    const date = parseSafeDate('2026-05-20T12:00:00.000Z');
    expect(date).toBeInstanceOf(Date);
    expect(date?.getTime()).toBeGreaterThan(0);
  });
});

describe('safeFormatDate', () => {
  it('does not throw on null', () => {
    expect(safeFormatDate(null, 'd MMM HH:mm', 'Sin expiración')).toBe('Sin expiración');
  });

  it('formats valid dates', () => {
    expect(safeFormatDate('2026-05-20T15:00:00.000Z', 'd MMM', '—')).toMatch(/\d+/);
  });
});

describe('safeFormatRelativeTime', () => {
  it('returns fallback for invalid dates', () => {
    expect(safeFormatRelativeTime(null)).toBe('—');
  });
});

describe('safeFormatTimeRemaining', () => {
  it('returns empty string by default for null', () => {
    expect(safeFormatTimeRemaining(null)).toBe('');
  });
});

describe('formatExpiryLabel', () => {
  it('shows friendly fallback when expiry is missing', () => {
    expect(formatExpiryLabel(null)).toBe('Sin expiración');
  });
});
