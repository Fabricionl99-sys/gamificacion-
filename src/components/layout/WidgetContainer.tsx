import { Suspense, lazy, useEffect, type LazyExoticComponent, type ReactElement } from 'react';
import { Skeleton } from '../ui/Skeleton';
import { ToastViewport } from '../ui/Toast';
import { BoostToastTrigger } from '../boost/BoostToast';
import { DesktopSidebar } from './DesktopSidebar';
import { TabNavigation } from './TabNavigation';
import { WidgetHeader } from './WidgetHeader';
import { FEATURES } from '../../config/features';
import { PILOT } from '../../config/pilot';
import { usePlayerStore } from '../../store/playerStore';
import { useUiStore } from '../../store/uiStore';
import { writePublicProfile } from '../../utils/profilePrivacy';
import type { TabId } from '../../types/navigation';

const HomeTab = lazy(() => import('../tabs/HomeTab'));
const MissionsTab = lazy(() => import('../tabs/MissionsTab'));
const ShopTab = lazy(() => import('../tabs/ShopTab'));
const StreakTab = lazy(() => import('../tabs/StreakTab'));
const RankingTab = lazy(() => import('../tabs/RankingTab'));
const TournamentsTab = lazy(() => import('../tabs/TournamentsTab'));
const PredictionsTab = lazy(() => import('../tabs/PredictionsTab'));
const FeedTab = lazy(() => import('../tabs/FeedTab'));
const NewsTab = lazy(() => import('../tabs/NewsTab'));
const OwnProfile = lazy(() => import('../profile/OwnProfile'));
const PublicProfile = lazy(() => import('../profile/PublicProfile'));
const PrivateProfile = lazy(() => import('../profile/PrivateProfile'));
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
  shop: ShopTab,
  streak: StreakTab,
  ranking: RankingTab,
  tournaments: TournamentsTab,
  predictions: PredictionsTab,
  social: FeedTab,
  news: NewsTab,
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
  const { activeTab, activeView, setActiveTab } = useUiStore();
  const safeActiveTab = !FEATURES.social_enabled && activeTab === 'social' ? 'home' : activeTab;
  const ActiveTab = tabComponents[safeActiveTab];

  if (safeActiveTab !== activeTab) {
    setTimeout(() => setActiveTab(safeActiveTab), 0);
  }

  if (activeView === 'own-profile') return <OwnProfile />;
  if (activeView === 'public-profile') return <PublicProfile />;
  if (activeView === 'private-profile') return <PrivateProfile />;
  return (
    <>
      <TabNavigation />
      <div key={safeActiveTab} className="animate-[tab-enter_180ms_ease-out] pt-4 md:pt-0">
        <ActiveTab />
      </div>
    </>
  );
}

export function WidgetContainer() {
  const { activeTab, setActiveTab } = useUiStore();

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
    setActiveTab(PILOT.defaultTab);
  }, [setActiveTab]);

  return (
    <div className="min-h-dvh bg-bg-primary text-text-primary md:flex md:items-stretch">
      <DesktopSidebar activeTab={activeTab} onSelect={setActiveTab} />
      <main className="mx-auto flex min-h-dvh w-full max-w-[460px] flex-col border-x border-border-subtle bg-[radial-gradient(circle_at_top,var(--accent-subtle),transparent_34%),var(--bg-primary)] md:max-w-none md:flex-1 md:border-x-0">
        <div className="sticky top-0 z-30 border-b border-border-subtle bg-bg-primary/85 px-4 pb-3 pt-4 backdrop-blur-xl md:px-6">
          <WidgetHeader />
        </div>
        <section className="flex-1 px-4 pb-8 pt-4 md:px-6">
          <Suspense fallback={<LoadingPanel />}>
            <MainView />
            <NotificationCenterModal />
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
