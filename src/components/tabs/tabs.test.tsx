import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '../../test/render';
import FeedTab from './FeedTab';
import HomeTab from './HomeTab';
import MissionsTab from './MissionsTab';
import RewardsTab from './RewardsTab';
import NewsTab from './NewsTab';
import PostEditorModal from '../modals/PostEditorModal';
import PostCommentsModal from '../modals/PostCommentsModal';
import PredictionsTab from './PredictionsTab';
import RankingTab from './RankingTab';
import ShopTab from './ShopTab';
import StreakTab from './StreakTab';
import TournamentsTab from './TournamentsTab';
import RafflesTab from './RafflesTab';

describe('tabs smoke', () => {
  it.each([
    ['home', <HomeTab />],
    ['missions', <MissionsTab />],
    ['rewards', <RewardsTab />],
    ['shop', <ShopTab />],
    ['streak', <StreakTab />],
    ['ranking', <RankingTab />],
    ['tournaments', <TournamentsTab />],
    ['predictions', <PredictionsTab />],
    ['raffles', <RafflesTab />],
    ['social', <FeedTab />],
    ['news', <NewsTab />],
  ])('renders %s tab without crashing', (_name, element) => {
    renderWithProviders(element);
    expect(document.body).toBeInTheDocument();
  });
});

describe('key tab interactions', () => {
  it('shows a claim action in missions', async () => {
    renderWithProviders(<MissionsTab />);
    await userEvent.click((await screen.findAllByRole('button', { name: /reclamar/i }))[0]);
    expect(screen.getAllByText(/completada/i).length).toBeGreaterThan(0);
    expect(await screen.findByText(/\+100 con x2 activo/i)).toBeInTheDocument();
    expect(screen.getAllByText(/casino/i).length).toBeGreaterThan(0);
  });

  it('shows shop stock, VIP and time restrictions', async () => {
    renderWithProviders(<ShopTab />);
    expect((await screen.findAllByText(/quedan 8/i)).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/vip diamond/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /agotado/i })).toBeDisabled();
    expect(screen.getAllByText(/\d+ días?|\d+h \d+m/i).length).toBeGreaterThan(0);
  });

  it('lets the player complete and review predictions', async () => {
    renderWithProviders(<PredictionsTab />);
    expect(await screen.findByText(/ganá monedas prediciendo resultados/i)).toBeInTheDocument();
    await userEvent.click((await screen.findAllByRole('button', { name: /Predecir/i }, { timeout: 3000 }))[0]);
    expect(await screen.findByText(/Confirmar predicción/i)).toBeDisabled();
    await userEvent.click((await screen.findAllByRole('button', { name: /local/i }))[0]);
    await userEvent.click(screen.getByRole('button', { name: /más 2\.5/i }));
    await userEvent.click(screen.getByRole('button', { name: /sí/i }));
    await userEvent.click(screen.getByRole('button', { name: /más 9\.5/i }));
    await userEvent.click(screen.getByRole('button', { name: /2-1/i }));
    expect(screen.getByRole('button', { name: /Confirmar predicción \(5\/5/i })).not.toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: /^Mis predicciones/i }));
    expect((await screen.findAllByRole('button', { name: /Ver mis predicciones/i })).length).toBeGreaterThan(0);
  });

  it('opens post editor from feed composer', async () => {
    renderWithProviders(
      <>
        <FeedTab />
        <PostEditorModal />
      </>,
    );
    await userEvent.click(screen.getByRole('button', { name: /que estas pensando/i }));
    expect(screen.getByRole('dialog', { name: /que estas pensando/i })).toBeInTheDocument();
  });

  it('supports social interactions on feed posts', async () => {
    renderWithProviders(
      <>
        <FeedTab />
        <PostCommentsModal />
      </>,
    );
    await userEvent.click(screen.getByRole('tab', { name: /siguiendo/i }));
    expect((await screen.findAllByText(/Manchester City|City o Chelsea/i)).length).toBeGreaterThan(0);

    const likeButton = screen.getByRole('button', { name: '42' });
    await userEvent.click(likeButton);
    expect(likeButton).toHaveAttribute('aria-pressed', 'true');

    await userEvent.click(screen.getAllByRole('button', { name: /copiar apuesta/i })[0]);

    await userEvent.click(screen.getByRole('button', { name: '2' }));
    expect(await screen.findByRole('dialog', { name: /comentarios/i })).toBeInTheDocument();
    expect(await screen.findByText(/Buena lectura/i, {}, { timeout: 3000 })).toBeInTheDocument();
  });

  it('renders BO-style ranking cards and leaderboard modal', async () => {
    renderWithProviders(<RankingTab />);
    expect(await screen.findByText(/competí con otros jugadores/i)).toBeInTheDocument();
    expect(screen.getByText(/Hay 2 rankings activos más/i)).toBeInTheDocument();
    await userEvent.click(screen.getAllByRole('button', { name: /Ver leaderboard completo/i })[0]);
    expect(await screen.findByRole('dialog', { name: /Mejores en XP/i })).toBeInTheDocument();
  });
});
