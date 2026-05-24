import { useEffect, useState } from 'react';

import { socialApi } from '../../../api/socialApi';
import { useSocialProfile } from '../../../hooks/useSocialProfile';
import { useToast } from '../../../hooks/useToast';
import type { SocialBlockedUser, SocialPrivacyMode, SocialProfilePublic } from '../../../types/socialModule';
import { toastMessageForSocialError } from '../../../utils/socialErrors';
import { getPlayerInitials } from '../../../utils/playerInitials';
import { FollowRequestsModal } from '../../modals/FollowRequestsModal';
import { Avatar } from '../../ui/Avatar';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { EmptyState } from '../../ui/EmptyState';

export function SocialTab() {
  const { profile, refresh, setProfile } = useSocialProfile();
  const toast = useToast();
  const [stats, setStats] = useState<SocialProfilePublic | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [privacy, setPrivacy] = useState<SocialPrivacyMode>('private');
  const [saving, setSaving] = useState(false);
  const [requestsOpen, setRequestsOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [blocked, setBlocked] = useState<SocialBlockedUser[]>([]);

  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.display_name_override ?? '');
    setBio(profile.bio ?? '');
    setPrivacy(profile.privacy_mode);
    void socialApi.getProfile(profile.player_state_id).then(setStats).catch(() => undefined);
    void socialApi
      .getFollowRequests()
      .then((page) => setPendingCount(page.items.length))
      .catch(() => undefined);
    void socialApi
      .getBlocks()
      .then((page) => setBlocked(page.items))
      .catch(() => undefined);
  }, [profile]);

  const handleSave = async () => {
    if (!profile || saving) return;
    setSaving(true);
    try {
      const updated = await socialApi.updateMyProfile({
        privacy_mode: privacy,
        bio: bio.trim() || null,
        display_name_override: displayName.trim() || null,
      });
      setProfile(updated);
      toast.success('Perfil social actualizado');
      await refresh();
    } catch (error) {
      toast.danger(toastMessageForSocialError(error, 'No se pudo guardar'));
    } finally {
      setSaving(false);
    }
  };

  const handleUnblock = async (playerStateId: string) => {
    try {
      await socialApi.unblockUser(playerStateId);
      setBlocked((current) => current.filter((b) => b.player_state_id !== playerStateId));
      toast.success('Usuario desbloqueado');
    } catch {
      toast.danger('No se pudo desbloquear');
    }
  };

  if (!profile) {
    return <Card className="p-4 text-sm text-text-secondary">Cargando perfil social…</Card>;
  }

  return (
    <div className="space-y-4">
      <Card className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary">Perfil social</h3>
          <Button size="sm" variant="secondary" onClick={() => setRequestsOpen(true)}>
            Solicitudes
            {pendingCount > 0 ? <Badge className="ml-2">{pendingCount}</Badge> : null}
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Avatar initials={getPlayerInitials(displayName || 'Jugador')} size="lg" />
          <div className="grid flex-1 grid-cols-3 gap-2 text-center text-sm">
            <div>
              <p className="font-semibold">{stats?.follower_count ?? 0}</p>
              <p className="text-metadata text-text-tertiary">seguidores</p>
            </div>
            <div>
              <p className="font-semibold">{stats?.following_count ?? 0}</p>
              <p className="text-metadata text-text-tertiary">siguiendo</p>
            </div>
            <div>
              <p className="font-semibold">{stats?.post_count ?? 0}</p>
              <p className="text-metadata text-text-tertiary">posts</p>
            </div>
          </div>
        </div>

        <label className="block text-sm text-text-secondary">
          Nombre visible
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value.slice(0, 40))}
            className="mt-1 w-full rounded-lg border border-border-default bg-bg-secondary px-3 py-2 text-sm text-text-primary"
          />
        </label>

        <label className="block text-sm text-text-secondary">
          Bio
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 160))}
            className="mt-1 min-h-20 w-full rounded-lg border border-border-default bg-bg-secondary p-3 text-sm text-text-primary"
          />
        </label>

        <label className="block text-sm text-text-secondary">
          Privacidad
          <select
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value as SocialPrivacyMode)}
            className="mt-1 w-full rounded-lg border border-border-default bg-bg-secondary px-3 py-2 text-sm text-text-primary"
          >
            <option value="private">Privado</option>
            <option value="followers_only">Solo seguidores</option>
            <option value="public">Público</option>
          </select>
        </label>

        <Button variant="primary" className="w-full" isLoading={saving} onClick={handleSave}>
          Guardar perfil social
        </Button>
      </Card>

      <Card className="space-y-3 p-4">
        <h3 className="text-sm font-semibold text-text-primary">Bloqueados</h3>
        {blocked.length === 0 ? (
          <EmptyState icon={<span className="text-lg">🚫</span>} title="No bloqueaste a nadie" description="Los usuarios que bloquees dejarán de aparecer en tu feed." />
        ) : (
          blocked.map((user) => (
            <div key={user.player_state_id} className="flex items-center gap-3">
              <Avatar initials={getPlayerInitials(user.display_name)} imageUrl={user.avatar_url} size="sm" />
              <p className="flex-1 text-sm text-text-primary">{user.display_name}</p>
              <Button size="sm" variant="ghost" onClick={() => void handleUnblock(user.player_state_id)}>
                Desbloquear
              </Button>
            </div>
          ))
        )}
      </Card>

      <FollowRequestsModal
        open={requestsOpen}
        onClose={() => setRequestsOpen(false)}
        onUpdated={() => {
          void socialApi
            .getFollowRequests()
            .then((page) => setPendingCount(page.items.length))
            .catch(() => undefined);
        }}
      />
    </div>
  );
}
