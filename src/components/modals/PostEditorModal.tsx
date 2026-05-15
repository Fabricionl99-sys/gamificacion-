import { Image, ShieldAlert } from 'lucide-react';
import { useEffect, useState } from 'react';

import { feedApi } from '../../api/feed';
import { useAsyncData } from '../../hooks/useAsyncData';
import { usePlayer } from '../../hooks/usePlayer';
import { useToast } from '../../hooks/useToast';
import { useModalsStore } from '../../store/modalsStore';
import { useSocialStore } from '../../store/socialStore';
import type { ShareablePick } from '../../types/social';
import { cn } from '../../utils/classnames';
import { readPublicProfile } from '../../utils/profilePrivacy';
import { emitWidgetEvent } from '../../utils/widgetEvents';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

export default function PostEditorModal() {
  const [body, setBody] = useState('');
  const [selectedPickId, setSelectedPickId] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const activeModal = useModalsStore((state) => state.activeModal);
  const closeModal = useModalsStore((state) => state.closeModal);
  const bumpFeed = useSocialStore((state) => state.bumpFeed);
  const { player } = usePlayer();
  const toast = useToast();
  const isPublicProfile = readPublicProfile() && !player.isPrivate;
  const { data: shareablePicks = [] } = useAsyncData(
    () => (activeModal === 'postEditor' ? feedApi.getShareablePicks() : Promise.resolve([] as ShareablePick[])),
    [],
    [activeModal],
  );
  const remaining = 280 - body.length;

  useEffect(() => {
    if (activeModal !== 'postEditor') {
      setBody('');
      setSelectedPickId(null);
    }
  }, [activeModal]);

  const handlePublish = async () => {
    if (!isPublicProfile) {
      toast.danger('Activá tu perfil público en ajustes para compartir apuestas');
      return;
    }
    if (body.trim().length === 0 || isPublishing) return;
    setIsPublishing(true);
    try {
      const post = await feedApi.createPost({
        body: body.trim(),
        sharePickId: selectedPickId ?? undefined,
      });
      emitWidgetEvent('postPublished', { postId: post.id, pendingReview: Boolean(post.pendingReview) });
      toast.success(post.pendingReview ? 'Post enviado a moderación' : 'Post publicado en social');
      bumpFeed();
      closeModal();
      setBody('');
      setSelectedPickId(null);
    } catch {
      toast.danger('No se pudo publicar el post');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Modal isOpen={activeModal === 'postEditor'} onClose={closeModal} title="nuevo post">
      <EditorContent
        body={body}
        setBody={setBody}
        isPublicProfile={isPublicProfile}
        playerAvatar={player.avatar}
        shareablePicks={shareablePicks}
        selectedPickId={selectedPickId}
        setSelectedPickId={setSelectedPickId}
        remaining={remaining}
        isPublishing={isPublishing}
        onCancel={closeModal}
        onPublish={handlePublish}
      />
    </Modal>
  );
}

function EditorContent({
  body,
  setBody,
  isPublicProfile,
  playerAvatar,
  shareablePicks,
  selectedPickId,
  setSelectedPickId,
  remaining,
  isPublishing,
  onCancel,
  onPublish,
}: {
  body: string;
  setBody: (value: string) => void;
  isPublicProfile: boolean;
  playerAvatar: string;
  shareablePicks: ShareablePick[];
  selectedPickId: string | null;
  setSelectedPickId: (value: string | null) => void;
  remaining: number;
  isPublishing: boolean;
  onCancel: () => void;
  onPublish: () => void;
}) {
  return (
    <div className="space-y-4">
      {!isPublicProfile ? (
        <p className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
          Necesitás un perfil público para compartir apuestas en social. Activá la opción en ajustes.
        </p>
      ) : null}
      <div className="flex gap-3">
        <Avatar initials={playerAvatar} size="md" />
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value.slice(0, 280))}
          placeholder="que estas pensando?"
          disabled={!isPublicProfile}
          className="min-h-32 flex-1 resize-none rounded-lg border border-border-default bg-bg-secondary p-3 text-sm text-text-primary outline-none transition focus:border-border-accent disabled:opacity-60"
        />
      </div>
      {isPublicProfile && shareablePicks.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">
            compartir apuesta (opcional)
          </p>
          <div className="space-y-2">
            {shareablePicks.map((pick) => {
              const selected = selectedPickId === pick.id;
              return (
                <button
                  key={pick.id}
                  type="button"
                  onClick={() => setSelectedPickId(selected ? null : pick.id)}
                  className={cn(
                    'w-full rounded-md border p-3 text-left transition',
                    selected
                      ? 'border-accent bg-accent/10'
                      : 'border-border-default bg-bg-tertiary hover:border-border-strong',
                  )}
                >
                  <p className="text-sm font-semibold text-text-primary">{pick.teams}</p>
                  <p className="text-xs text-text-secondary">
                    {pick.prediction} · cuota {pick.odds}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
      <div className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-xs text-text-secondary">
        <WarningBanner />
        <p className="mt-1">El filtro automatico bloquea URLs, spam, palabras prohibidas y montos.</p>
      </div>
      <div className="flex items-center justify-between">
        <Button variant="ghost" leftIcon={<Image className="h-4 w-4" />} disabled>
          imagen
        </Button>
        <span className="text-xs text-text-tertiary">{remaining} caracteres</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="secondary" onClick={onCancel}>
          cancelar
        </Button>
        <Button
          variant="primary"
          disabled={!isPublicProfile || body.trim().length === 0 || isPublishing}
          isLoading={isPublishing}
          onClick={onPublish}
        >
          publicar
        </Button>
      </div>
    </div>
  );
}

function WarningBanner() {
  return (
    <div className="flex items-center gap-2 font-medium text-warning">
      <ShieldAlert className="h-4 w-4" />
      los montos de tus apuestas nunca son visibles
    </div>
  );
}
