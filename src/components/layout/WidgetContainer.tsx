import { Suspense, lazy, useEffect, type LazyExoticComponent, type ReactElement } from 'react';
import { Skeleton } from '../ui/Skeleton';
import { ToastViewport } from '../ui/Toast';
import { BoostToastTrigger } from '../boost/BoostToast';
import { DesktopSidebar } from './DesktopSidebar';
import { TabNavigation } from './TabNavigation';
import { WidgetHeader } from './WidgetHeader';
import { FEATURES } from '../../config/features';
import { PILOT } from '../../config/pilot';
import { useWidgetNavigation } from '../../hooks/useWidgetNavigation';
import { usePlayerStore } from '../../store/playerStore';
import { useUiStore } from '../../store/uiStore';
import { writePublicProfile } from '../../utils/profilePrivacy';
import type { TabId } from '../../types/navigation';
import { SectionErrorBoundary } from '../ui/SectionErrorBoundary';
import { tabs } from './navigation';

const tabSectionLabels = Object.fromEntries(tabs.map((tab) => [tab.id, tab.label])) as Record<TabId, string>;

const HomeTab = lazy(() => import('../tabs/HomeTab'));
const MissionsTab = lazy(() => import('../tabs/MissionsTab'));
const RewardsTab = lazy(() => import('../tabs/RewardsTab'));
const ShopTab = lazy(() => import('../tabs/ShopTab'));
const StreakTab = lazy(() => import('../tabs/StreakTab'));
const RankingTab = lazy(() => import('../tabs/RankingTab'));
const TournamentsTab = lazy(() => import('../tabs/TournamentsTab'));
const PredictionsTab = lazy(() => import('../tabs/PredictionsTab'));
const RafflesTab = lazy(() => import('../tabs/RafflesTab'));
const FeedTab = lazy(() => import('../tabs/FeedTab'));
const NewsTab = lazy(() => import('../tabs/NewsTab'));
const AvatarsTab = lazy(() => import('../tabs/AvatarsTab'));
const OwnProfile = lazy(() => import('../profile/OwnProfile'));
const PlayerPublicProfile = lazy(() => import('../profile/PlayerPublicProfile'));
const NotificationCenterModal = lazy(() => import('../modals/NotificationCenterModal'));
const PurchaseConfirmModal = lazy(() => import('../modals/PurchaseConfirmModal'));
const ShopItemDetailModal = lazy(() => import('../modals/ShopItemDetailModal'));
const MissionDetailModal = lazy(() => import('../modals/MissionDetailModal'));
const PostEditorModal = lazy(() => import('../modals/PostEditorModal'));
const PostCommentsModal = lazy(() => import('../modals/PostCommentsModal'));
const TournamentRegisterModal = lazy(() => import('../modals/TournamentRegisterModal'));
const DivisionPrizesModal = lazy(() => import('../modals/DivisionPrizesModal'));
const MysteryBoxModal = lazy(() => import('../modals/MysteryBoxModal'));
const WheelModal = lazy(() => import('../modals/WheelModal'));
const StreakChestModal = lazy(() => import('../modals/StreakChestModal'));
const ScratchCardModal = lazy(() => import('../modals/ScratchCardModal'));
const LevelUpModal = lazy(() => import('../modals/LevelUpModal'));

const tabComponents: Record<TabId, LazyExoticComponent<() => ReactElement>> = {
  home: HomeTab,
  missions: MissionsTab,
  rewards: RewardsTab,
  shop: ShopTab,
  streak: StreakTab,
  ranking: RankingTab,
  tournaments: TournamentsTab,
  predictions: PredictionsTab,
  raffles: RafflesTab,
  social: FeedTab,
  news: NewsTab,
  avatars: AvatarsTab,
  profile: HomeTab,
};

function LoadingPanel() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-28" />
      <Skeleton className="h-20" />
      <Skeleton className="h-20" />
    </div>
  );
}

function MainView() {
  const { activeTab, activeView } = useUiStore();
  const { navigateToTab } = useWidgetNavigation();
  const safeActiveTab = !FEATURES.social_enabled && activeTab === 'social' ? 'home' : activeTab;
  const ActiveTab = tabComponents[safeActiveTab];

  if (safeActiveTab !== activeTab) {
    setTimeout(() => navigateToTab(safeActiveTab), 0);
  }

  if (activeView === 'own-profile') {
    return (
      <SectionErrorBoundary section="Mi perfil">
        <OwnProfile />
      </SectionErrorBoundary>
    );
  }
  if (activeView === 'player-profile') {
    return (
      <SectionErrorBoundary section="Perfil del jugador">
        <PlayerPublicProfile />
      </SectionErrorBoundary>
    );
  }
  return (
    <>
      <TabNavigation />
      <div key={safeActiveTab} className="animate-[tab-enter_180ms_ease-out] pt-4 md:pt-0">
        <SectionErrorBoundary section={tabSectionLabels[safeActiveTab] ?? safeActiveTab}>
          <ActiveTab />
        </SectionErrorBoundary>
      </div>
    </>
  );
}

export function WidgetContainer() {
  const { activeTab } = useUiStore();
  const { navigateToTab } = useWidgetNavigation();

  useEffect(() => {
    const t = localStorage.getItem('wingoat_theme');
    if (t === 'light') document.documentElement.classList.remove('dark');
    else document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    if (!PILOT.isActive()) return;
    if (PILOT.ensurePublicProfile) {
      writePublicProfile(true);
      usePlayerStore.getState().updatePlayer({ isPrivate: false });
    }
  }, []);

  return (
    <div className="min-h-dvh bg-bg-primary text-text-primary md:flex md:items-stretch">
      <DesktopSidebar activeTab={activeTab} onSelect={navigateToTab} />
      <main className="mx-auto flex min-h-dvh w-full max-w-[460px] flex-col border-x border-border-subtle bg-[radial-gradient(circle_at_12%_0%,var(--accent-subtle),transparent_34%),var(--bg-primary)] md:max-w-none md:flex-1 md:border-x-0">
        <div className="sticky top-0 z-30 border-b border-border-subtle bg-bg-primary/85 px-4 pb-3 pt-4 backdrop-blur-xl md:px-6">
          <SectionErrorBoundary section="Cabecera">
            <WidgetHeader />
          </SectionErrorBoundary>
        </div>
        <section className="flex-1 px-4 pb-8 pt-2 md:px-6 md:pt-4">
          <Suspense fallback={<LoadingPanel />}>
            <MainView />
            <SectionErrorBoundary section="Notificaciones">
              <NotificationCenterModal />
            </SectionErrorBoundary>
            <PurchaseConfirmModal />
            <ShopItemDetailModal />
            <MissionDetailModal />
            <PostEditorModal />
            <PostCommentsModal />
            <TournamentRegisterModal />
            <DivisionPrizesModal />
            <MysteryBoxModal />
            <WheelModal />
            <StreakChestModal />
            <ScratchCardModal />
            <LevelUpModal />
            <BoostToastTrigger />
          </Suspense>
        </section>
      </main>
      <ToastViewport />
    </div>
  );
}
