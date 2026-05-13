/** Paleta oscura acotada (reproducible por hash del nombre). */
const AVATAR_PALETTE = [
  'linear-gradient(145deg,#1a3d32 0%,#0d2620 100%)',
  'linear-gradient(145deg,#2a2650 0%,#15122e 100%)',
  'linear-gradient(145deg,#3d2438 0%,#22141f 100%)',
  'linear-gradient(145deg,#244060 0%,#122436 100%)',
  'linear-gradient(145deg,#354018 0%,#1c2210 100%)',
  'linear-gradient(145deg,#402818 0%,#24150e 100%)',
  'linear-gradient(145deg,#1f3550 0%,#101b2e 100%)',
  'linear-gradient(145deg,#303030 0%,#181818 100%)',
  'linear-gradient(145deg,#1a4048 0%,#0e2228 100%)',
  'linear-gradient(145deg,#382040 0%,#1c1024 100%)',
];

function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function getAvatarBackgroundFromName(fullName: string): string {
  const key = fullName.trim() || 'player';
  return AVATAR_PALETTE[hashString(key) % AVATAR_PALETTE.length];
}
