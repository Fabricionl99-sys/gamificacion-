import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { describe, expect, it } from 'vitest';

import LevelUpModal from './LevelUpModal';
import MysteryBoxModal from './MysteryBoxModal';
import NotificationCenterModal from './NotificationCenterModal';
import PurchaseConfirmModal from './PurchaseConfirmModal';
import ScratchCardModal from './ScratchCardModal';
import StreakChestModal from './StreakChestModal';
import WheelModal from './WheelModal';
import { useModalsStore } from '../../store/modalsStore';
import { renderWithProviders } from '../../test/render';

describe('critical modals', () => {
  const cases = [
    { modal: 'levelUp', title: /level up/i, Component: LevelUpModal },
    { modal: 'mysteryBox', title: /caja misteriosa/i, Component: MysteryBoxModal },
    { modal: 'wheel', title: /rueda de la fortuna/i, Component: WheelModal },
    { modal: 'streakChest', title: /cofre de racha/i, Component: StreakChestModal },
    { modal: 'scratchCard', title: /raspadita/i, Component: ScratchCardModal },
    { modal: 'purchase', title: /confirmar canje/i, Component: PurchaseConfirmModal },
    { modal: 'notifications', title: /notificaciones/i, Component: NotificationCenterModal },
  ] as const;

  it.each(cases)('opens and closes $modal', async ({ modal, title, Component }) => {
    const user = userEvent.setup();
    act(() => {
      useModalsStore.getState().openModal(modal);
    });
    renderWithProviders(<Component />);

    expect(screen.getByRole('dialog', { name: title })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /cerrar modal/i }));
    expect(screen.queryByRole('dialog', { name: title })).not.toBeInTheDocument();
  });
});
