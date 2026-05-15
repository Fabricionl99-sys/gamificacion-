import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import App from '../App';
import { useModalsStore } from '../store/modalsStore';
import { useShopStore } from '../store/shopStore';
import { mockShopItems } from '../mocks/index';
import { useUiStore } from '../store/uiStore';
import { renderWithRouter } from '../test/render';

const tabLabels = ['inicio', 'misiones', 'tienda', 'social', 'racha', 'ranking', 'torneos', 'predicciones', 'noticias'] as const;

describe('widget smoke', () => {
  it('renders WidgetContainer shell', async () => {
    renderWithRouter(<App />);
    expect(await screen.findByLabelText('Estado del jugador', {}, { timeout: 15000 })).toBeInTheDocument();
    expect(await screen.findByText(/x2 hasta \d{1,2}:\d{2}/i)).toBeInTheDocument();
  });

  it('renders all 9 tabs without crashing', async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />);
    await screen.findByLabelText('Estado del jugador', {}, { timeout: 15000 });
    expect(await screen.findByText(/x2 hasta \d{1,2}:\d{2}/i)).toBeInTheDocument();

    for (const label of tabLabels) {
      await user.click(screen.getAllByRole('button', { name: new RegExp(label, 'i') })[0]);
      expect(screen.getByLabelText('Estado del jugador')).toBeInTheDocument();
    }
  });

  it('opens and closes critical modals', async () => {
    renderWithRouter(<App />);
    await screen.findByLabelText('Estado del jugador', {}, { timeout: 15000 });

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
      act(() => {
        if (modal === 'purchase') {
          useShopStore.getState().setSelectedItem(mockShopItems[1]);
        }
        useModalsStore.getState().openModal(modal);
      });
      await waitFor(() => expect(screen.getByRole('dialog', { name: title })).toBeInTheDocument());
      await userEvent.click(screen.getByRole('button', { name: /cerrar modal/i }));
      await waitFor(() => expect(screen.queryByRole('dialog', { name: title })).not.toBeInTheDocument());
    }
  });

  it('supports key interactions in main tabs', async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />);
    await screen.findByLabelText('Estado del jugador', {}, { timeout: 15000 });

    act(() => useUiStore.getState().setActiveTab('missions'));
    expect((await screen.findAllByRole('button', { name: /reclamar/i })).length).toBeGreaterThan(0);
    expect(await screen.findAllByText(/\+100 con x2 activo/i)).toHaveLength(1);

    act(() => useUiStore.getState().setActiveTab('shop'));
    expect(await screen.findByRole('button', { name: /agotado/i })).toBeDisabled();
    expect(screen.getAllByText(/quedan 8/i).length).toBeGreaterThan(0);

    act(() => useUiStore.getState().setActiveTab('ranking'));
    expect(await screen.findByText(/competí con otros jugadores/i)).toBeInTheDocument();
    await user.click(screen.getAllByRole('button', { name: /Ver leaderboard completo/i })[0]);
    expect(await screen.findByRole('dialog', { name: /Mejores en XP/i })).toBeInTheDocument();
  });
});
