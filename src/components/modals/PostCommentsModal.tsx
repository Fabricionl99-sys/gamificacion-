import { Send } from 'lucide-react';
import { useEffect, useState } from 'react';

import { feedApi } from '../../api/feed';
import { useAsyncData } from '../../hooks/useAsyncData';
import { useToast } from '../../hooks/useToast';
import { useSocialStore } from '../../store/socialStore';
import type { FeedComment } from '../../types/social';
import { formatRelativeTime } from '../../utils/format';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Skeleton } from '../ui/Skeleton';

export default function PostCommentsModal() {
  const commentsPostId = useSocialStore((state) => state.commentsPostId);
  const closeComments = useSocialStore((state) => state.closeComments);
  const bumpFeed = useSocialStore((state) => state.bumpFeed);
  const toast = useToast();
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localComments, setLocalComments] = useState<FeedComment[]>([]);

  const { data: comments = [], isLoading } = useAsyncData(
    () => (commentsPostId ? feedApi.getComments(commentsPostId) : Promise.resolve([])),
    [],
    [commentsPostId],
  );

  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  useEffect(() => {
    if (!commentsPostId) setBody('');
  }, [commentsPostId]);

  const handleSubmit = async () => {
    if (!commentsPostId || body.trim().length === 0 || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const comment = await feedApi.addComment(commentsPostId, body.trim());
      setLocalComments((current) => [...current, comment]);
      setBody('');
      bumpFeed();
    } catch {
      toast.danger('No se pudo publicar el comentario');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={Boolean(commentsPostId)}
      onClose={closeComments}
      title="comentarios"
      description="interactuá sin compartir montos ni datos sensibles"
    >
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
          </div>
        ) : localComments.length > 0 ? (
          <ul className="max-h-64 space-y-3 overflow-y-auto pr-1">
            {localComments.map((comment) => (
              <li key={comment.id} className="flex gap-3 rounded-md bg-bg-tertiary p-3">
                <Avatar initials={comment.authorAvatar} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-text-primary">{comment.authorName}</p>
                    <span className="text-xs text-text-tertiary">{formatRelativeTime(comment.createdAt)}</span>
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">{comment.body}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-md bg-bg-tertiary p-3 text-sm text-text-secondary">
            todavía no hay comentarios. sé el primero en responder.
          </p>
        )}
        <div className="flex gap-2">
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value.slice(0, 280))}
            placeholder="escribí un comentario..."
            className="min-h-20 flex-1 resize-none rounded-lg border border-border-default bg-bg-secondary p-3 text-sm text-text-primary outline-none transition focus:border-border-accent"
          />
          <Button
            variant="primary"
            size="icon"
            className="h-10 w-10 shrink-0 self-end"
            aria-label="publicar comentario"
            disabled={body.trim().length === 0 || isSubmitting}
            isLoading={isSubmitting}
            onClick={handleSubmit}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Modal>
  );
}
