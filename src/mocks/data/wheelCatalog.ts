import type { WheelVisualConfig } from '../../lib/wheelDisplay';
import { wheelSegmentsFromPrizes } from '../../lib/wheelDisplay';

/** Demo wheel config until player inventory returns full type payload. */
export const DEMO_WHEEL_VISUAL: WheelVisualConfig = {
  backgroundImageUrl:
    'https://images.unsplash.com/photo-1611591437281-460bfac57584?w=512',
  centerLogoUrl: 'https://dummyimage.com/128x128/0AF784/0E1116&text=OP',
  segments: wheelSegmentsFromPrizes([
    {
      name: '25 monedas',
      color_theme: '#FDE68A',
      image_url: 'https://images.unsplash.com/photo-1621761190629-7961477624c4?w=128',
      display_order: 0,
    },
    {
      name: '50 monedas',
      color_theme: '#FCD34D',
      image_url: 'https://images.unsplash.com/photo-1621761190629-7961477624c4?w=128',
      display_order: 1,
    },
    {
      name: '100 XP',
      color_theme: '#FBBF24',
      image_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=128',
      display_order: 2,
    },
    {
      name: '3 Free Spins',
      color_theme: '#F59E0B',
      image_url: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=128',
      display_order: 3,
    },
    {
      name: 'Cofre Bronce',
      color_theme: '#D97706',
      image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=128',
      display_order: 4,
    },
    {
      name: 'Freebet $2',
      color_theme: '#B45309',
      image_url: 'https://images.unsplash.com/photo-1607863680198-23d4b2565df0?w=128',
      display_order: 5,
    },
    {
      name: '200 monedas',
      color_theme: '#92400E',
      image_url: 'https://images.unsplash.com/photo-1621761190629-7961477624c4?w=128',
      display_order: 6,
    },
    {
      name: 'Jackpot',
      color_theme: '#78350F',
      image_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=128',
      display_order: 7,
    },
  ]),
};
