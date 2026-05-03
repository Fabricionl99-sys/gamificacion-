import { Image, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

import { useToast } from '../../hooks/useToast';
import { mockPlayer } from '../../mocks';
import { useModalsStore } from '../../store/modalsStore';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

export default function PostEditorModal() {
  const [body, setBody] = useState('');
  const activeModal = useModalsStore((state) => state.activeModal);
  const closeModal = useModalsStore((state) => state.closeModal);
  const toast = useToast();
  const remaining = 280 - body.length;

  return (
    <Modal isOpen={activeModal === 'postEditor'} onClose={closeModal} title="nuevo post">
      <div className="space-y-4">
        <div className="flex gap-3">
          <Avatar initials={mockPlayer.avatar} size="md" />
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value.slice(0, 280))}
            placeholder="que estas pensando?"
            className="min-h-32 flex-1 resize-none rounded-lg border border-border-default bg-bg-secondary p-3 text-sm text-text-primary outline-none transition focus:border-border-accent"
          />
        </div>
        <div className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-xs text-text-secondary">
          <div className="flex items-center gap-2 font-medium text-warning">
            <ShieldAlert className="h-4 w-4" />
            los montos de tus apuestas nunca son visibles
          </div>
          <p className="mt-1">El filtro automatico bloquea URLs, spam, palabras prohibidas y montos.</p>
        </div>
        <div className="flex items-center justify-between">
          <Button variant="ghost" leftIcon={<Image className="h-4 w-4" />}>
            imagen
          </Button>
          <span className="text-xs text-text-tertiary">{remaining} caracteres</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={closeModal}>
            cancelar
          </Button>
          <Button
            variant="primary"
            disabled={body.trim().length === 0}
            onClick={() => {
              toast.success('Post enviado a moderacion');
              closeModal();
              setBody('');
            }}
          >
            publicar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
