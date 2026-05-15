import { useState } from 'react';
import { Lock, Send } from 'lucide-react';

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
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { Tabs } from '../ui/Tabs';
import PostCard from '../shared/PostCard';
import { ExploreFeedEmptyState, FollowingFeedEmptyState } from './emptyStateCopy';

export default function FeedTab() {
  const openModal = useModalsStore((state) => state.openModal);
  const feedRefreshKey = useSocialStore((state) => state.feedRefreshKey);
  const bumpFeed = useSocialStore((state) => state.bumpFeed);
  const { player } = usePlayer();
  const [activeFeed, setActiveFeed] = useState<FeedScope>('following');
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
            <button
              type="button"
              onClick={() => openModal('postEditor')}
              className="min-h-12 flex-1 rounded-md border border-border-default bg-bg-tertiary px-3 text-left text-sm text-text-tertiary transition-colors hover:bg-bg-elevated"
            >
              que estas pensando?
            </button>
          </div>
          <ComposerActions onOpenEditor={() => openModal('postEditor')} />
        </Card>
      ) : (
        <Card className="flex items-start gap-3 border-warning/30 bg-warning/10 p-4">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <div>
            <p className="text-sm font-semibold text-text-primary">perfil privado</p>
            <p className="mt-1 text-sm text-text-secondary">
              Activá tu perfil público en ajustes para compartir apuestas. Podés seguir viendo el feed y copiar fijas de otros.
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

function ComposerActions({ onOpenEditor }: { onOpenEditor: () => void }) {
  return (
    <div className="flex justify-end">
      <Button size="sm" variant="primary" leftIcon={<Send className="h-4 w-4" />} onClick={onOpenEditor}>
        publicar
      </Button>
    </div>
  );
}
