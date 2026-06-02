import { UserCircle2 } from 'lucide-react';

import { getAvatarInventory, getAvatars, type PlayerAvatar } from '../../api/avatars';
import { useAsyncData } from '../../hooks/useAsyncData';
import { getAvatarImageUrl } from '../../utils/avatarImageUrl';
import { Card } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { Skeleton } from '../ui/Skeleton';
import { SectionHeader } from '../shared/SectionHeader';

function AvatarTile({ avatar }: { avatar: PlayerAvatar }) {
  const imageUrl = getAvatarImageUrl(avatar);
  return (
    <Card className="flex flex-col items-center gap-2 p-4 text-center">
      <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-full border border-border-default bg-bg-tertiary">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <UserCircle2 className="h-8 w-8 text-text-tertiary" />
        )}
      </div>
      <p className="text-sm font-semibold text-text-primary">{avatar.name}</p>
      {avatar.is_active ? (
        <span className="text-[11px] font-medium uppercase tracking-wide text-accent">en uso</span>
      ) : null}
    </Card>
  );
}

export default function AvatarsTab() {
  const { data: inventory = [], isLoading: invLoading } = useAsyncData(getAvatarInventory, []);
  const { data: catalog = [], isLoading: catLoading } = useAsyncData(getAvatars, []);

  const isLoading = invLoading || catLoading;
  const owned = inventory.length > 0 ? inventory : catalog;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  if (owned.length === 0) {
    return (
      <EmptyState
        icon={<UserCircle2 className="h-8 w-8" />}
        title="Sin avatares todavía"
        description="Desbloqueá avatares completando misiones o canjeando en la tienda."
      />
    );
  }

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Tus avatares"
        description="Avatares desbloqueados y disponibles para tu perfil."
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {owned.map((avatar) => (
          <AvatarTile key={avatar.id} avatar={avatar} />
        ))}
      </div>
    </div>
  );
}
