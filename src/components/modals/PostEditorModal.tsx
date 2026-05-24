import { useEffect, useState } from 'react';

import { socialApi } from '../../api/socialApi';
import { useToast } from '../../hooks/useToast';
import { useModalsStore } from '../../store/modalsStore';
import { useSocialStore } from '../../store/socialStore';
import { toastMessageForSocialError } from '../../utils/socialErrors';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

export default function PostEditorModal() {
  const [content, setContent] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const activeModal = useModalsStore((state) => state.activeModal);
  const closeModal = useModalsStore((state) => state.closeModal);
  const bumpFeed = useSocialStore((state) => state.bumpFeed);
  const toast = useToast();
  const remaining = 500 - content.length;

  useEffect(() => {
    if (activeModal !== 'postEditor') setContent('');
  }, [activeModal]);

  const handlePublish = async () => {
    if (content.trim().length === 0 || isPublishing) return;
    setIsPublishing(true);
    try {
      await socialApi.createPost(content.trim());
      toast.success('Post publicado');
      bumpFeed();
      closeModal();
      setContent('');
    } catch (error) {
      toast.danger(toastMessageForSocialError(error, 'No se pudo publicar el post'));
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Modal isOpen={activeModal === 'postEditor'} onClose={closeModal} title="Crear post" description="Solo texto, sin enlaces">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value.slice(0, 500))}
        placeholder="¿Qué querés compartir?"
        className="min-h-32 w-full resize-none rounded-lg border border-border-default bg-bg-secondary p-3 text-sm text-text-primary outline-none focus:border-border-accent"
      />
      <div className="mt-2 flex items-center justify-between">
        <span className="text-metadata text-text-tertiary">{remaining} caracteres</span>
        <Button variant="primary" disabled={content.trim().length === 0} isLoading={isPublishing} onClick={handlePublish}>
          Publicar
        </Button>
      </div>
    </Modal>
  );
}
