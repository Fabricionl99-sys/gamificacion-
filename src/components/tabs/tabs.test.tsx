import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '../../test/render';
import FeedTab from './FeedTab';
import HomeTab from './HomeTab';
import MissionsTab from './MissionsTab';
import NewsTab from './NewsTab';
import PostEditorModal from '../modals/PostEditorModal';
import PredictionsTab from './PredictionsTab';
import RankingTab from './RankingTab';
import ShopTab from './ShopTab';
import StreakTab from './StreakTab';
import TournamentsTab from './TournamentsTab';

describe('tabs smoke', () => {
  it.each([
    ['home', <HomeTab />],
    ['missions', <MissionsTab />],
    ['shop', <ShopTab />],
    ['streak', <StreakTab />],
    ['ranking', <RankingTab />],
    ['tournaments', <TournamentsTab />],
    ['predictions', <PredictionsTab />],
    ['feed', <FeedTab />],
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
  });

  it('keeps insufficient balance shop item disabled', async () => {
    renderWithProviders(<ShopTab />);
    expect(await screen.findByRole('button', { name: /saldo insuficiente/i })).toBeDisabled();
  });

  it('opens post editor from feed composer', async () => {
    renderWithProviders(
      <>
        <FeedTab />
        <PostEditorModal />
      </>,
    );
    await userEvent.click(screen.getByRole('button', { name: /que estas pensando/i }));
    expect(screen.getByRole('dialog', { name: /nuevo post/i })).toBeInTheDocument();
  });

  it('toggles ranking period controls', async () => {
    renderWithProviders(<RankingTab />);
    const monthButton = await screen.findByRole('button', { name: /este mes/i });
    await userEvent.click(monthButton);
    expect(monthButton).toHaveAttribute('aria-pressed', 'true');
  });
});
