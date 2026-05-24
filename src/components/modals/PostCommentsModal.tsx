import { Send, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { socialApi } from '../../api/socialApi';
import { useSocialProfile } from '../../hooks/useSocialProfile';
import { useToast } from '../../hooks/useToast';
import { useSocialStore } from '../../store/socialStore';
import type { SocialComment } from '../../types/socialModule';
import { toastMessageForSocialError } from '../../utils/socialErrors';
import { formatRelativeTime } from '../../utils/format';
import { getPlayerInitials } from '../../utils/playerInitials';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Skeleton } from '../ui/Skeleton';

export default function PostCommentsModal() {
  const commentsPostId = useSocialStore((state) => state.commentsPostId);
  const closeComments = useSocialStore((state) => state.closeComments);
  const bumpFeed = useSocialStore((state) => state.bumpFeed);
  const { profile } = useSocialProfile();
  const toast = useToast();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState<SocialComment[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const loadComments = useCallback(async (postId: string, cursor?: string | null) => {
    setIsLoading(!cursor);
    try {
      const page = await socialApi.getComments(postId, cursor);
      setComments((current) => (cursor ? [...current, ...page.items] : page.items));
      setNextCursor(page.next_cursor);
    } catch {
      toast.danger('No pudimos cargar los comentarios');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!commentsPostId) {
      setContent('');
      setComments([]);
      setNextCursor(null);
      return;
    }
    void loadComments(commentsPostId);
  }, [commentsPostId, loadComments]);

  const handleSubmit = async () => {
    if (!commentsPostId || content.trim().length === 0 || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const comment = await socialApi.addComment(commentsPostId, content.trim());
      setComments((current) => [...current, comment]);
      setContent('');
      bumpFeed();
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    } catch (error) {
      toast.danger(toastMessageForSocialError(error, 'No se pudo publicar el comentario'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await socialApi.deleteComment(commentId);
      setComments((current) => current.filter((c) => c.id !== commentId));
      bumpFeed();
    } catch {
      toast.danger('No se pudo eliminar el comentario');
    }
  };

  return (
    <Modal isOpen={Boolean(commentsPostId)} onClose={closeComments} title="Comentarios">
      <div ref={listRef} className="max-h-72 space-y-3 overflow-y-auto pr-1">
        {isLoading ? (
          <>
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
          </>
        ) : comments.length > 0 ? (
          comments.map((comment) => {
            const isMine = profile?.player_state_id === comment.author_id;
            return (
              <div key={comment.id} className="flex gap-3 rounded-md bg-bg-tertiary p-3">
                <Avatar
                  initials={getPlayerInitials(comment.author_display_name)}
                  imageUrl={comment.author_avatar_url}
                  size="sm"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-text-primary">{comment.author_display_name}</p>
                    <span className="text-metadata text-text-tertiary">{formatRelativeTime(comment.created_at)}</span>
                    {isMine ? (
                      <button
                        type="button"
                        className="ml-auto text-text-tertiary hover:text-danger"
                        aria-label="eliminar comentario"
                        onClick={() => void handleDelete(comment.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">{comment.content}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="rounded-md bg-bg-tertiary p-3 text-sm text-text-secondary">Todavía no hay comentarios.</p>
        )}
        {nextCursor ? (
          <Button size="sm" variant="ghost" className="w-full" onClick={() => commentsPostId && loadComments(commentsPostId, nextCursor)}>
            Cargar más
          </Button>
        ) : null}
      </div>
      <div className="mt-4 flex gap-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, 280))}
          placeholder="Escribir comentario…"
          className="min-h-20 flex-1 resize-none rounded-lg border border-border-default bg-bg-secondary p-3 text-sm text-text-primary outline-none focus:border-border-accent"
        />
        <Button
          variant="primary"
          size="icon"
          className="h-10 w-10 shrink-0 self-end"
          aria-label="publicar comentario"
          disabled={content.trim().length === 0 || isSubmitting}
          isLoading={isSubmitting}
          onClick={handleSubmit}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Modal>
  );
}
