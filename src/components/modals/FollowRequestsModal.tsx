import { useEffect, useState } from 'react';

import { socialApi } from '../../api/socialApi';
import { useToast } from '../../hooks/useToast';
import type { SocialFollowRequest } from '../../types/socialModule';
import { getPlayerInitials } from '../../utils/playerInitials';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface FollowRequestsModalProps {
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

export function FollowRequestsModal({ open, onClose, onUpdated }: FollowRequestsModalProps) {
  const toast = useToast();
  const [items, setItems] = useState<SocialFollowRequest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    void socialApi
      .getFollowRequests()
      .then((page) => setItems(page.items))
      .catch(() => toast.danger('No pudimos cargar solicitudes'))
      .finally(() => setLoading(false));
  }, [open, toast]);

  const respond = async (followId: string, action: 'accept' | 'reject') => {
    try {
      if (action === 'accept') await socialApi.acceptFollowRequest(followId);
      else await socialApi.rejectFollowRequest(followId);
      setItems((current) => current.filter((item) => item.id !== followId));
      onUpdated?.();
    } catch {
      toast.danger('No se pudo actualizar la solicitud');
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Solicitudes pendientes">
      {loading ? <p className="text-sm text-text-secondary">Cargando…</p> : null}
      {!loading && items.length === 0 ? (
        <p className="text-sm text-text-secondary">No tenés solicitudes pendientes.</p>
      ) : null}
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3 rounded-lg bg-bg-tertiary p-3">
            <Avatar initials={getPlayerInitials(item.follower_display_name)} imageUrl={item.follower_avatar_url} size="sm" />
            <p className="flex-1 text-sm font-medium text-text-primary">{item.follower_display_name}</p>
            <Button size="sm" variant="primary" onClick={() => void respond(item.id, 'accept')}>
              Aceptar
            </Button>
            <Button size="sm" variant="ghost" onClick={() => void respond(item.id, 'reject')}>
              Rechazar
            </Button>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
