import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BoostToast } from './BoostToast';

describe('BoostToast', () => {
  it('shows boosted XP and multiplier copy', () => {
    render(<BoostToast baseXP={100} multiplier={2} />);
    expect(screen.getByRole('status')).toHaveTextContent('+200 XP');
    expect(screen.getByText(/x2 boost activo/i)).toBeInTheDocument();
  });
});
