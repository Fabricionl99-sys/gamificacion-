import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

import { socialApi } from '../../api/socialApi';
import { useToast } from '../../hooks/useToast';
import { useSocialStore } from '../../store/socialStore';
import type { SocialPost } from '../../types/socialModule';
import { getPlayerInitials } from '../../utils/playerInitials';
import { formatRelativeTime } from '../../utils/format';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface SocialPostCardProps {
  post: SocialPost;
  onUpdated?: () => void;
  onReport?: (post: SocialPost) => void;
  onBlock?: (post: SocialPost) => void;
  onViewProfile?: (playerStateId: string) => void;
}

export default function SocialPostCard({
  post,
  onUpdated,
  onReport,
  onBlock,
  onViewProfile,
}: SocialPostCardProps) {
  const toast = useToast();
  const openComments = useSocialStore((state) => state.openComments);
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [liked, setLiked] = useState(post.viewer_has_liked);
  const [isLiking, setIsLiking] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = getPlayerInitials(post.author_display_name);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((c) => Math.max(0, c + (wasLiked ? -1 : 1)));
    try {
      const result = wasLiked ? await socialApi.unlikePost(post.id) : await socialApi.likePost(post.id);
      setLikeCount(result.like_count);
      setLiked('liked' in result ? result.liked : !wasLiked);
      onUpdated?.();
    } catch {
      setLiked(wasLiked);
      setLikeCount((c) => Math.max(0, c + (wasLiked ? 1 : -1)));
      toast.danger('No se pudo registrar el me gusta');
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Card className="space-y-3">
      <div className="flex items-start gap-3">
        <button type="button" onClick={() => onViewProfile?.(post.author_id)} className="shrink-0">
          <Avatar initials={initials} imageUrl={post.author_avatar_url} label={post.author_display_name} size="md" />
        </button>
        <div className="min-w-0 flex-1">
          <button
            type="button"
            className="text-left text-sm font-semibold text-text-primary hover:text-accent"
            onClick={() => onViewProfile?.(post.author_id)}
          >
            {post.author_display_name}
          </button>
          <p className="text-metadata text-text-tertiary">{formatRelativeTime(post.created_at)}</p>
        </div>
        <div className="relative">
          <button
            type="button"
            className="rounded-full p-1 text-text-tertiary hover:bg-bg-tertiary hover:text-text-primary"
            aria-label="opciones del post"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {menuOpen ? (
            <div className="absolute right-0 z-10 mt-1 min-w-36 rounded-lg border border-border-default bg-bg-elevated py-1 shadow-lg">
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-sm text-text-secondary hover:bg-bg-tertiary"
                onClick={() => {
                  setMenuOpen(false);
                  onReport?.(post);
                }}
              >
                Reportar
              </button>
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-sm text-danger hover:bg-bg-tertiary"
                onClick={() => {
                  setMenuOpen(false);
                  onBlock?.(post);
                }}
              >
                Bloquear
              </button>
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-sm text-text-secondary hover:bg-bg-tertiary"
                onClick={() => {
                  setMenuOpen(false);
                  onViewProfile?.(post.author_id);
                }}
              >
                Ver perfil
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <p className="whitespace-pre-wrap text-sm text-text-secondary">{post.content}</p>

      <div className="flex items-center gap-4 border-t border-border-subtle pt-3">
        <Button
          variant="ghost"
          size="sm"
          className={liked ? 'text-danger' : 'text-text-tertiary'}
          leftIcon={<Heart className={liked ? 'fill-current' : ''} />}
          onClick={handleLike}
          isLoading={isLiking}
        >
          {likeCount}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-text-tertiary"
          leftIcon={<MessageCircle />}
          onClick={() => openComments(post.id)}
        >
          {post.comment_count}
        </Button>
      </div>
    </Card>
  );
}
