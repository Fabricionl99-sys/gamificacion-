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
  const [selectedPickIds, setSelectedPickIds] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const activeModal = useModalsStore((state) => state.activeModal);
  const closeModal = useModalsStore((state) => state.closeModal);
  const bumpFeed = useSocialStore((state) => state.bumpFeed);
  const postComposerMode = useSocialStore((state) => state.postComposerMode);
  const setPostComposerMode = useSocialStore((state) => state.setPostComposerMode);
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
      setSelectedPickIds([]);
      setPostComposerMode('thought');
    }
  }, [activeModal, setPostComposerMode]);

  const handlePublish = async () => {
    if (!isPublicProfile) {
      toast.danger('Activá tu perfil público en ajustes para compartir apuestas');
      return;
    }
    if (isPublishing) return;

    if (postComposerMode === 'thought') {
      if (body.trim().length === 0) return;
    } else if (selectedPickIds.length === 0) {
      toast.danger('Seleccioná al menos una selección del cupón');
      return;
    }

    setIsPublishing(true);
    try {
      const post =
        postComposerMode === 'thought'
          ? await feedApi.createPost({ body: body.trim(), kind: 'thought' })
          : await feedApi.createPost({
              body: body.trim(),
              sharePickIds: selectedPickIds,
              kind: 'bet_ticket',
            });
      emitWidgetEvent('postPublished', { postId: post.id, pendingReview: Boolean(post.pendingReview) });
      toast.success(post.pendingReview ? 'Post enviado a moderación' : 'Publicado en social');
      bumpFeed();
      closeModal();
      setBody('');
      setSelectedPickIds([]);
    } catch {
      toast.danger('No se pudo publicar el post');
    } finally {
      setIsPublishing(false);
    }
  };

  const togglePick = (id: string) => {
    setSelectedPickIds((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
    );
  };

  return (
    <Modal
      isOpen={activeModal === 'postEditor'}
      onClose={closeModal}
      title={postComposerMode === 'thought' ? 'Que estas pensando?' : 'Publicar ticket de apuesta'}
    >
      <EditorContent
        body={body}
        isPublicProfile={isPublicProfile}
        mode={postComposerMode}
        onModeChange={setPostComposerMode}
        playerAvatar={player.avatar}
        remaining={remaining}
        selectedPickIds={selectedPickIds}
        setBody={setBody}
        shareablePicks={shareablePicks}
        togglePick={togglePick}
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
  mode,
  onModeChange,
  playerAvatar,
  shareablePicks,
  selectedPickIds,
  togglePick,
  remaining,
  isPublishing,
  onCancel,
  onPublish,
}: {
  body: string;
  setBody: (value: string) => void;
  isPublicProfile: boolean;
  mode: 'thought' | 'bet_ticket';
  onModeChange: (mode: 'thought' | 'bet_ticket') => void;
  playerAvatar: string;
  shareablePicks: ShareablePick[];
  selectedPickIds: string[];
  togglePick: (id: string) => void;
  remaining: number;
  isPublishing: boolean;
  onCancel: () => void;
  onPublish: () => void;
}) {
  const canPublishThought = mode === 'thought' && body.trim().length > 0;
  const canPublishBet = mode === 'bet_ticket' && selectedPickIds.length > 0;

  return (
    <div className="space-y-4">
      {!isPublicProfile ? (
        <p className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
          Necesitás un perfil público para compartir en social. Activá la opción en ajustes.
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-2 rounded-lg border border-border-default bg-bg-tertiary p-1">
        <button
          type="button"
          className={cn(
            'min-h-11 rounded-md px-3 py-2 text-sm font-semibold transition',
            mode === 'thought' ? 'bg-accent text-bg-primary shadow-glow' : 'text-text-secondary hover:text-text-primary',
          )}
          onClick={() => onModeChange('thought')}
        >
          pensamiento
        </button>
        <button
          type="button"
          className={cn(
            'min-h-11 rounded-md px-3 py-2 text-sm font-semibold transition',
            mode === 'bet_ticket' ? 'bg-accent text-bg-primary shadow-glow' : 'text-text-secondary hover:text-text-primary',
          )}
          onClick={() => onModeChange('bet_ticket')}
        >
          ticket de apuesta
        </button>
      </div>

      <div className="flex gap-3">
        <Avatar initials={playerAvatar} size="md" />
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value.slice(0, 280))}
          placeholder={mode === 'thought' ? 'que estas pensando?' : 'pie opcional (visible bajo tu usuario en el ticket)'}
          disabled={!isPublicProfile}
          className="min-h-28 flex-1 resize-none rounded-lg border border-border-default bg-bg-secondary p-3 text-sm text-text-primary outline-none transition focus:border-border-accent disabled:opacity-60"
        />
      </div>

      {isPublicProfile && mode === 'bet_ticket' && shareablePicks.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">
            selecciones de tu cupón (una o varias)
          </p>
          <p className="text-xs text-text-secondary">
            Cuando apostás en el proveedor y tu perfil es público, el ticket se publica solo. Acá simulamos las
            selecciones recientes para armar el mismo formato.
          </p>
          <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
            {shareablePicks.map((pick) => {
              const selected = selectedPickIds.includes(pick.id);
              return (
                <button
                  key={pick.id}
                  type="button"
                  onClick={() => togglePick(pick.id)}
                  className={cn(
                    'w-full rounded-md border p-3 text-left transition',
                    selected
                      ? 'border-accent bg-accent/10'
                      : 'border-border-default bg-bg-tertiary hover:border-border-strong',
                  )}
                >
                  <p className="text-sm font-semibold uppercase text-text-primary">{pick.teams}</p>
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
        <div className="flex items-center gap-2 font-medium text-warning">
          <ShieldAlert className="h-4 w-4" />
          los montos de tus apuestas nunca son visibles
        </div>
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
          disabled={!isPublicProfile || (!canPublishThought && !canPublishBet) || isPublishing}
          isLoading={isPublishing}
          onClick={onPublish}
        >
          publicar
        </Button>
      </div>
    </div>
  );
}
