import { describe, expect, it } from 'vitest';

import { PlayerGameCurrencyBadge } from './PlayerGameCurrencyBadge';
import { render, screen } from '@testing-library/react';

describe('PlayerGameCurrencyBadge', () => {
  it('renders currency code with tooltip', () => {
    render(<PlayerGameCurrencyBadge currencyCode="RD" />);
    expect(screen.getByTitle('Tu moneda de juego: RD')).toHaveTextContent('RD');
  });

  it('returns null for empty code', () => {
    const { container } = render(<PlayerGameCurrencyBadge currencyCode="" />);
    expect(container).toBeEmptyDOMElement();
  });
});
