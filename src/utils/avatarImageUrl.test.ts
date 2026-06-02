import { describe, expect, it } from 'vitest';

import { getAvatarImageUrl } from './avatarImageUrl';

describe('getAvatarImageUrl', () => {
  it('prefers image_urls.original over image_url', () => {
    expect(
      getAvatarImageUrl({
        image_urls: { original: 'https://cdn.social2game.com/a.png' },
        image_url: 'https://cdn.social2game.com/b.png',
      }),
    ).toBe('https://cdn.social2game.com/a.png');
  });

  it('falls back to image_url when original is missing', () => {
    expect(getAvatarImageUrl({ image_url: 'https://cdn.social2game.com/b.png' })).toBe(
      'https://cdn.social2game.com/b.png',
    );
  });

  it('reads avatar_image_url from inventory rows', () => {
    expect(getAvatarImageUrl({ avatar_image_url: 'https://cdn.social2game.com/c.png' })).toBe(
      'https://cdn.social2game.com/c.png',
    );
  });
});
