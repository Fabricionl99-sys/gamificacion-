import { useCallback, useEffect, useRef, useState } from 'react';
import { PenLine } from 'lucide-react';

import { socialApi } from '../../api/socialApi';
import { useCursorList } from '../../hooks/useCursorList';
import { useSocialProfile } from '../../hooks/useSocialProfile';
import { useToast } from '../../hooks/useToast';
import { useWidgetNavigation } from '../../hooks/useWidgetNavigation';
import { useModalsStore } from '../../store/modalsStore';
import type { SocialPost } from '../../types/socialModule';
import { useSocialStore } from '../../store/socialStore';
import SocialPostCard from '../shared/SocialPostCard';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { Tabs } from '../ui/Tabs';
import { ExploreFeedEmptyState, FollowingFeedEmptyState } from './emptyStateCopy';
import ReportPostModal from '../modals/ReportPostModal';

type FeedScope = 'feed' | 'explore';

export default function FeedTab() {
  const openModal = useModalsStore((state) => state.openModal);
  const feedRefreshKey = useSocialStore((state) => state.feedRefreshKey);
  const bumpFeed = useSocialStore((state) => state.bumpFeed);
  const { navigateToPlayerProfile } = useWidgetNavigation();
  const toast = useToast();
  const { profile, isLoading: profileLoading } = useSocialProfile();
  const [scope, setScope] = useState<FeedScope>('feed');
  const [reportPost, setReportPost] = useState<SocialPost | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loader = useCallback(
    (cursor?: string | null) => (scope === 'feed' ? socialApi.getFeed(cursor) : socialApi.getExplore(cursor)),
    [scope],
  );

  const { items, isLoading, isLoadingMore, error, nextCursor, loadMore, reset } = useCursorList(loader, [
    scope,
    feedRefreshKey,
  ]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !nextCursor) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadMore();
      },
      { rootMargin: '120px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore, nextCursor]);

  const handleBlock = async (post: SocialPost) => {
    if (!window.confirm(`¿Bloquear a ${post.author_display_name}?`)) return;
    try {
      await socialApi.blockUser(post.author_id);
      toast.success('Usuario bloqueado');
      reset();
    } catch {
      toast.danger('No se pudo bloquear al usuario');
    }
  };

  if (profile?.is_banned_social) {
    return (
      <Card className="border-danger/40 bg-danger/10 p-4">
        <p className="text-sm font-semibold text-danger">Tu perfil social está suspendido</p>
        <p className="mt-1 text-module-body text-text-secondary">Contactá soporte para más información.</p>
      </Card>
    );
  }

  const moduleInactive = error?.includes('Social no está activo');

  return (
    <div className="space-y-4">
      <Tabs
        tabSize="comfortable"
        tabs={[
          { id: 'feed', label: 'para vos' },
          { id: 'explore', label: 'explorar' },
        ]}
        activeTab={scope}
        onChange={(id) => setScope(id as FeedScope)}
        ariaLabel="Filtros del feed social"
      />

      <Button
        variant="primary"
        className="w-full"
        leftIcon={<PenLine className="h-4 w-4" />}
        onClick={() => openModal('postEditor')}
      >
        Crear post
      </Button>

      {moduleInactive ? (
        <Card className="p-4">
          <p className="text-sm text-text-secondary">{error}</p>
        </Card>
      ) : null}

      {isLoading || profileLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      ) : error && !moduleInactive ? (
        <Card className="p-4">
          <p className="text-sm text-danger">{error}</p>
          <Button className="mt-3" size="sm" variant="secondary" onClick={reset}>
            Reintentar
          </Button>
        </Card>
      ) : items.length > 0 ? (
        <div className="space-y-3">
          {items.map((post) => (
            <SocialPostCard
              key={post.id}
              post={post}
              onUpdated={bumpFeed}
              onReport={setReportPost}
              onBlock={handleBlock}
              onViewProfile={navigateToPlayerProfile}
            />
          ))}
          {nextCursor ? (
            <div ref={sentinelRef} className="py-2 text-center text-metadata text-text-tertiary">
              {isLoadingMore ? 'Cargando…' : ''}
            </div>
          ) : null}
        </div>
      ) : scope === 'explore' ? (
        <ExploreFeedEmptyState />
      ) : (
        <FollowingFeedEmptyState onExplore={() => setScope('explore')} />
      )}

      <ReportPostModal post={reportPost} onClose={() => setReportPost(null)} />
    </div>
  );
}
