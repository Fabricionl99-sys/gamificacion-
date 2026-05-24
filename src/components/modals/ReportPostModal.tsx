import { useState } from 'react';

import { socialApi } from '../../api/socialApi';
import { useToast } from '../../hooks/useToast';
import type { SocialPost } from '../../types/socialModule';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface ReportPostModalProps {
  post: SocialPost | null;
  onClose: () => void;
}

export default function ReportPostModal({ post, onClose }: ReportPostModalProps) {
  const toast = useToast();
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async () => {
    if (!post || reason.trim().length < 3 || busy) return;
    setBusy(true);
    try {
      await socialApi.reportPost(post.id, reason.trim());
      toast.success('Reporte enviado');
      setReason('');
      onClose();
    } catch {
      toast.danger('No se pudo enviar el reporte');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal isOpen={Boolean(post)} onClose={onClose} title="Reportar post" description="Contanos qué está mal">
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value.slice(0, 280))}
        placeholder="Motivo del reporte…"
        className="min-h-24 w-full rounded-lg border border-border-default bg-bg-secondary p-3 text-sm text-text-primary outline-none focus:border-border-accent"
      />
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" size="sm" disabled={reason.trim().length < 3} isLoading={busy} onClick={handleSubmit}>
          Enviar reporte
        </Button>
      </div>
    </Modal>
  );
}
