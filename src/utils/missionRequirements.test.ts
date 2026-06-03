import { describe, expect, it } from 'vitest';

import { adaptMissionRequirement, formatMissionActionLabel } from './missionRequirements';

describe('formatMissionActionLabel', () => {
  it('formats bet_amount with currency', () => {
    expect(
      formatMissionActionLabel({ type: 'bet_amount', amount: 1003, currency_code: 'USD' }),
    ).toBe('Apostar $1.003 USD');
  });

  it('formats deposit_amount', () => {
    expect(
      formatMissionActionLabel({ type: 'deposit_amount', amount: 100, currency_code: 'USD' }),
    ).toBe('Depositar $100 USD');
  });

  it('formats verify flags', () => {
    expect(formatMissionActionLabel({ type: 'verify_kyc' })).toBe('Verificar identidad (KYC)');
    expect(formatMissionActionLabel({ type: 'verify_email' })).toBe('Verificar email');
  });

  it('formats bet_category with optional amount', () => {
    expect(formatMissionActionLabel({ type: 'bet_category', category_slug: 'slots', amount: 50 })).toBe(
      'Apostar $50 en slots',
    );
    expect(formatMissionActionLabel({ type: 'bet_category', category_slug: 'casino' })).toBe(
      'Apostar en casino',
    );
  });
});

describe('adaptMissionRequirement', () => {
  it('maps JP_Slots bet progress', () => {
    const row = adaptMissionRequirement({
      id: 'act-bet',
      config: { type: 'bet_amount', amount: 1003, currency_code: 'USD' },
      current_value: 250,
      target_value: 1003,
      is_complete: false,
    });
    expect(row.label).toBe('Apostar $1.003 USD');
    expect(row.showProgress).toBe(true);
    expect(row.currentValue).toBe(250);
    expect(row.targetValue).toBe(1003);
    expect(row.isComplete).toBe(false);
  });

  it('marks verify_email complete without progress suffix', () => {
    const row = adaptMissionRequirement({
      id: 'act-email',
      config: { type: 'verify_email' },
      current_value: 1,
      target_value: 1,
      is_complete: true,
    });
    expect(row.isComplete).toBe(true);
    expect(row.showProgress).toBe(false);
  });
});
