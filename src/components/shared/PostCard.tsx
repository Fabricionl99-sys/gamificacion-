import { Copy, Heart, MessageCircle, MoreHorizontal, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

import { feedApi } from '../../api/feed';
import { useToast } from '../../hooks/useToast';
import { useSocialStore } from '../../store/socialStore';
import type { FeedPost } from '../../types/social';
import { cn } from '../../utils/classnames';
import { formatRelativeTime } from '../../utils/format';
import { emitWidgetEvent } from '../../utils/widgetEvents';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface PostCardProps {
  post: FeedPost;
  onUpdated?: () => void;
}

export default function PostCard({ post, onUpdated }: PostCardProps) {
  const toast = useToast();
  const openComments = useSocialStore((state) => state.openComments);
  const [likes, setLikes] = useState(post.likes);
  const [likedByMe, setLikedByMe] = useState(Boolean(post.likedByMe));
  const [isLiking, setIsLiking] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    const nextLiked = !likedByMe;
    setLikedByMe(nextLiked);
    setLikes((current) => Math.max(0, current + (nextLiked ? 1 : -1)));
    try {
      const response = await feedApi.toggleLike(post.id);
      setLikes(response.likes);
      setLikedByMe(response.likedByMe);
      onUpdated?.();
    } catch {
      setLikedByMe(!nextLiked);
      setLikes((current) => Math.max(0, current + (nextLiked ? -1 : 1)));
      toast.danger('No se pudo registrar el me gusta');
    } finally {
      setIsLiking(false);
    }
  };

  const handleCopyPick = async () => {
    if (!post.sharedPick || isCopying) return;
    setIsCopying(true);
    try {
      const response = await feedApi.copyPick(post.id, post.sharedPick.id);
      emitWidgetEvent('betCopied', response);
      toast.success('Fija copiada al cupón del operador');
    } catch {
      toast.danger('No se pudo copiar la apuesta');
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <Card className="space-y-3">
      <div className="flex items-start gap-3">
        <Avatar initials={post.authorAvatar} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-text-primary">{post.authorName}</p>
            {post.vipTier ? <Badge variant="warning">{post.vipTier}</Badge> : null}
            <span className="text-xs text-text-tertiary">nivel {post.level}</span>
          </div>
          <p className="text-xs text-text-tertiary">{formatRelativeTime(post.createdAt)}</p>
        </div>
        <button
          type="button"
          className="rounded-full p-1 text-text-tertiary hover:bg-bg-tertiary hover:text-text-primary"
          aria-label="opciones del post"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
      <p className="text-sm text-text-secondary">{post.body}</p>
      {post.sharedPick ? (
        <Button
          size="sm"
          variant="secondary"
          className="w-full"
          leftIcon={<Copy className="h-4 w-4" />}
          onClick={handleCopyPick}
          isLoading={isCopying}
        >
          copiar apuesta
        </Button>
      ) : null}
      {post.accuratePrediction ? (
        <div className="rounded-md border border-border-accent bg-accent-subtle p-3">
          <Badge variant="success">PREDICCION ACERTADA</Badge>
          <p className="mt-2 text-sm font-semibold text-text-primary">{post.accuratePrediction.detail}</p>
          <p className="text-xs font-semibold text-accent">+{post.accuratePrediction.xp} XP</p>
        </div>
      ) : null}
      {post.pendingReview ? (
        <p className="rounded-md bg-warning/10 p-2 text-xs text-warning">
          pendiente de revision · visible solo para vos
        </p>
      ) : null}
      <div className="flex items-center gap-4 border-t border-border-subtle pt-3 text-xs text-text-tertiary">
        <button
          type="button"
          className={cn(
            'inline-flex items-center gap-1 transition-colors',
            likedByMe ? 'text-danger' : 'hover:text-text-primary',
          )}
          onClick={handleLike}
          disabled={isLiking}
          aria-pressed={likedByMe}
        >
          <Heart className={cn('h-4 w-4', likedByMe && 'fill-current')} /> {likes}
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1 hover:text-text-primary"
          onClick={() => openComments(post.id)}
        >
          <MessageCircle className="h-4 w-4" /> {post.comments}
        </button>
        <span className="ml-auto inline-flex items-center gap-1">
          <ShieldCheck className="h-3 w-3" /> sin montos visibles
        </span>
      </div>
    </Card>
  );
}
