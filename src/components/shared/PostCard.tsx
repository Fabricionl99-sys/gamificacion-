import { Heart, MessageCircle, MoreHorizontal, ShieldCheck } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import type { FeedPost } from '../../types/social';
import { formatRelativeTime } from '../../utils/format';
import { useToast } from '../../hooks/useToast';

interface PostCardProps {
  post: FeedPost;
}

export default function PostCard({ post }: PostCardProps) {
  const toast = useToast();

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
        <div className="rounded-md border border-border-default bg-bg-tertiary p-3">
          <Badge variant="info">FIJA COMPARTIDA</Badge>
          <p className="mt-2 text-sm font-semibold text-text-primary">{post.sharedPick.teams}</p>
          <p className="text-xs text-text-secondary">
            {post.sharedPick.prediction} · cuota {post.sharedPick.odds}
          </p>
          <p className="mt-1 text-xs text-text-tertiary">estado: {post.sharedPick.status}</p>
        </div>
      ) : null}
      {post.accuratePrediction ? (
        <div className="rounded-md border border-border-accent bg-accent-subtle p-3">
          <Badge variant="success">PREDICCION ACERTADA</Badge>
          <p className="mt-2 text-sm font-semibold text-text-primary">{post.accuratePrediction.detail}</p>
          <p className="text-xs font-semibold text-accent">+{post.accuratePrediction.xp} XP</p>
        </div>
      ) : null}
      {post.pendingReview ? (
        <p className="rounded-md bg-warning/10 p-2 text-xs text-warning">pendiente de revision · visible solo para vos</p>
      ) : null}
      <div className="flex items-center gap-4 border-t border-border-subtle pt-3 text-xs text-text-tertiary">
        <button
          type="button"
          className="inline-flex items-center gap-1 hover:text-text-primary"
          onClick={() => toast.success('like registrado')}
        >
          <Heart className="h-4 w-4" /> {post.likes}
        </button>
        <button type="button" className="inline-flex items-center gap-1 hover:text-text-primary">
          <MessageCircle className="h-4 w-4" /> {post.comments}
        </button>
        <span className="ml-auto inline-flex items-center gap-1">
          <ShieldCheck className="h-3 w-3" /> sin montos visibles
        </span>
      </div>
    </Card>
  );
}
