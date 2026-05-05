import { useState } from 'react';
import { Image, Send } from 'lucide-react';

import { feedApi } from '../../api/feed';
import { useAsyncData } from '../../hooks/useAsyncData';
import { useModalsStore } from '../../store/modalsStore';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { Tabs } from '../ui/Tabs';
import PostCard from '../shared/PostCard';
import { FollowingFeedEmptyState } from './emptyStateCopy';

export default function FeedTab() {
  const openModal = useModalsStore((state) => state.openModal);
  const [activeFeed, setActiveFeed] = useState('following');
  const { data: posts = [], isLoading } = useAsyncData(feedApi.list);

  return (
    <div className="space-y-4">
      <Tabs
        tabs={[
          { id: 'following', label: 'siguiendo' },
          { id: 'explore', label: 'explorar' },
        ]}
        activeTab={activeFeed}
        onChange={setActiveFeed}
        ariaLabel="Filtros del feed"
      />
      <Card className="space-y-3">
        <div className="flex gap-3">
          <Avatar initials="JM" size="md" />
          <button
            type="button"
            onClick={() => openModal('postEditor')}
            className="min-h-12 flex-1 rounded-md border border-border-default bg-bg-tertiary px-3 text-left text-sm text-text-tertiary transition-colors hover:bg-bg-elevated"
          >
            que estas pensando?
          </button>
        </div>
        <div className="flex justify-between">
          <Button size="sm" variant="ghost" leftIcon={<Image className="h-4 w-4" />}>
            imagen
          </Button>
          <Button size="sm" variant="primary" leftIcon={<Send className="h-4 w-4" />}>
            publicar
          </Button>
        </div>
      </Card>
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <FollowingFeedEmptyState />
      )}
    </div>
  );
}
