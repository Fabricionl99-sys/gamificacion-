import { useMemo } from 'react';

import { getAvatarInventory } from '../api/avatars';
import { getPlayerInitials } from '../utils/playerInitials';
import { getAvatarImageUrl } from '../utils/avatarImageUrl';
import { useAsyncData } from './useAsyncData';
import { usePlayer } from './usePlayer';

export function usePlayerAvatarDisplay() {
  const { player } = usePlayer();
  const { data: inventory = [] } = useAsyncData(getAvatarInventory, []);

  return useMemo(() => {
    const code = player.avatar?.trim() ?? '';
    const initials = (code.slice(0, 2) || getPlayerInitials(player.name)).slice(0, 2).toUpperCase();
    const equipped =
      inventory.find((item) => item.is_active) ??
      (code ? inventory.find((item) => item.code === code) : undefined) ??
      inventory[0];

    const imageUrl =
      player.avatarImageUrl ??
      (equipped ? getAvatarImageUrl(equipped) : null) ??
      getAvatarImageUrl({
        image_url: code.startsWith('http') ? code : null,
      });

    return { imageUrl, initials, code, inventory };
  }, [inventory, player.avatar, player.avatarImageUrl, player.name]);
}
