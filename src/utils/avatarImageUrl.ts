type AvatarImageSource = {
  image_urls?: { original?: string | null } | Record<string, string | null | undefined> | null;
  image_url?: string | null;
  avatar_image_url?: string | null;
} | null | undefined;

/** td-96: prefer composite image_urls.original, then flat image_url / avatar_image_url. */
export function getAvatarImageUrl(source: AvatarImageSource): string | null {
  if (!source) return null;

  if (typeof source.avatar_image_url === 'string' && source.avatar_image_url.trim()) {
    return source.avatar_image_url.trim();
  }

  const urls = source.image_urls;
  if (urls && typeof urls === 'object') {
    const original = urls.original;
    if (typeof original === 'string' && original.trim()) return original.trim();
  }

  if (typeof source.image_url === 'string' && source.image_url.trim()) {
    return source.image_url.trim();
  }

  return null;
}
