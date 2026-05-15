import { useState } from 'react';
import { Lock } from 'lucide-react';

import { feedApi } from '../../api/feed';
import { PILOT } from '../../config/pilot';
import { useAsyncData } from '../../hooks/useAsyncData';
import { usePlayer } from '../../hooks/usePlayer';
import { useModalsStore } from '../../store/modalsStore';
import { useSocialStore } from '../../store/socialStore';
import type { FeedScope } from '../../types/social';
import { readPublicProfile } from '../../utils/profilePrivacy';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { Tabs } from '../ui/Tabs';
import PostCard from '../shared/PostCard';
import { ExploreFeedEmptyState, FollowingFeedEmptyState } from './emptyStateCopy';

export default function FeedTab() {
  const openModal = useModalsStore((state) => state.openModal);
  const setPostComposerMode = useSocialStore((state) => state.setPostComposerMode);
  const feedRefreshKey = useSocialStore((state) => state.feedRefreshKey);
  const bumpFeed = useSocialStore((state) => state.bumpFeed);
  const { player } = usePlayer();
  const [activeFeed, setActiveFeed] = useState<FeedScope>(() => (PILOT.isActive() ? 'explore' : 'following'));
  const isPublicProfile = readPublicProfile() && !player.isPrivate;
  const { data: posts = [], isLoading } = useAsyncData(
    () => feedApi.list(activeFeed),
    [],
    [activeFeed, feedRefreshKey],
  );

  return (
    <div className="space-y-4">
      {PILOT.isActive() && PILOT.showBanner ? (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2">
          <Badge variant="success">piloto social</Badge>
          <p className="text-xs text-text-secondary">
            Datos mock · compartir, like, comentar y copiar fijas sin montos
          </p>
        </div>
      ) : null}
      <Tabs
        tabSize="comfortable"
        tabs={[
          { id: 'following', label: 'siguiendo' },
          { id: 'explore', label: 'explorar' },
        ]}
        activeTab={activeFeed}
        onChange={(tabId) => setActiveFeed(tabId as FeedScope)}
        ariaLabel="Filtros del feed"
      />
      {isPublicProfile ? (
        <Card className="space-y-3">
          <div className="flex gap-3">
            <Avatar initials={player.avatar} size="md" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setPostComposerMode('thought');
                  openModal('postEditor');
                }}
                className="min-h-12 w-full rounded-lg border border-border-default bg-bg-tertiary px-4 py-3 text-left text-sm font-medium text-text-tertiary transition-colors hover:bg-bg-elevated"
              >
                que estas pensando?
              </button>
              <button
                type="button"
                onClick={() => {
                  setPostComposerMode('bet_ticket');
                  openModal('postEditor');
                }}
                className="min-h-12 w-full rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-left text-sm font-semibold text-accent transition-colors hover:bg-accent/15"
              >
                publicar ticket de apuesta
              </button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="flex items-start gap-3 border-warning/30 bg-warning/10 p-4">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <div>
            <p className="text-sm font-semibold text-text-primary">perfil privado</p>
            <p className="mt-1 text-sm text-text-secondary">
              Activá tu perfil público en ajustes para compartir apuestas. Podés seguir viendo el feed y copiar fijas de
              otros.
            </p>
          </div>
        </Card>
      )}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onUpdated={bumpFeed} />
          ))}
        </div>
      ) : activeFeed === 'explore' ? (
        <ExploreFeedEmptyState />
      ) : (
        <FollowingFeedEmptyState />
      )}
    </div>
  );
}
