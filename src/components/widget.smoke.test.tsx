import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import App from '../App';
import { useModalsStore } from '../store/modalsStore';
import { useUiStore } from '../store/uiStore';
import { renderWithRouter } from '../test/render';

const tabLabels = ['inicio', 'misiones', 'tienda', 'racha', 'ranking', 'torneos', 'predicciones', 'noticias'] as const;

describe('widget smoke', () => {
  it('renders WidgetContainer shell', async () => {
    renderWithRouter(<App />);
    expect(await screen.findByLabelText('Estado del jugador')).toBeInTheDocument();
    expect(screen.getByText('ver perfil')).toBeInTheDocument();
  });

  it('renders all 9 tabs without crashing', async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />);
    await screen.findByLabelText('Estado del jugador');

    const moreButton = screen.queryByRole('button', { name: /\+4/i });
    if (moreButton) {
      await user.click(moreButton);
    }

    for (const label of tabLabels) {
      await user.click(screen.getAllByRole('button', { name: new RegExp(label, 'i') })[0]);
      expect(screen.getByLabelText('Estado del jugador')).toBeInTheDocument();
    }
  });

  it('opens and closes critical modals', async () => {
    renderWithRouter(<App />);
    await screen.findByLabelText('Estado del jugador');

    const modals = [
      ['levelUp', /level up/i],
      ['mysteryBox', /caja misteriosa/i],
      ['wheel', /rueda de la fortuna/i],
      ['streakChest', /cofre de racha/i],
      ['scratchCard', /raspadita/i],
      ['purchase', /confirmar canje/i],
      ['notifications', /notificaciones/i],
    ] as const;

    for (const [modal, title] of modals) {
      act(() => useModalsStore.getState().openModal(modal));
      await waitFor(() => expect(screen.getByRole('dialog', { name: title })).toBeInTheDocument());
      await userEvent.click(screen.getByRole('button', { name: /cerrar modal/i }));
      await waitFor(() => expect(screen.queryByRole('dialog', { name: title })).not.toBeInTheDocument());
    }
  });

  it('supports key interactions in main tabs', async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />);
    await screen.findByLabelText('Estado del jugador');

    act(() => useUiStore.getState().setActiveTab('missions'));
    expect((await screen.findAllByRole('button', { name: /reclamar/i })).length).toBeGreaterThan(0);

    act(() => useUiStore.getState().setActiveTab('shop'));
    expect(await screen.findByRole('button', { name: /saldo insuficiente/i })).toBeDisabled();

    act(() => useUiStore.getState().setActiveTab('ranking'));
    expect(await screen.findByRole('button', { name: /esta semana/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /este mes/i }));
    expect(screen.getByRole('button', { name: /este mes/i })).toBeInTheDocument();
  });
});
