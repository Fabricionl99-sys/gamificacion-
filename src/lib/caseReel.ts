/** Carrete horizontal estilo CS:GO — constantes compartidas con la referencia HTML. */
export const CASE_ITEM_WIDTH_PX = 150;
export const CASE_ITEM_GAP_PX = 14;
export const REEL_FRAME_HEIGHT_PX = 170;
export const REEL_ITEM_HEIGHT_PX = 150;
export const REEL_ITEM_TOP_MARGIN_PX = 10;
export const REEL_STRIP_COUNT = 70;
export const REEL_WIN_STRIP_INDEX = 62;
export const REEL_SPIN_DURATION_MS = 5000;

export function caseItemStride(): number {
  return CASE_ITEM_WIDTH_PX + CASE_ITEM_GAP_PX;
}

/** Curva de frenado: ~70% del recorrido al inicio, final lento y tenso. */
export function reelEase(t: number): number {
  return 1 - (1 - t) ** 4.2;
}

/** Posición final translateX para centrar el ganador bajo el marcador. */
export function computeReelTarget(
  frameWidthPx: number,
  winStripIndex: number = REEL_WIN_STRIP_INDEX,
): number {
  const stride = caseItemStride();
  const marker = frameWidthPx / 2;
  const jitter = (Math.random() * 2 - 1) * (CASE_ITEM_WIDTH_PX * 0.28);
  const winCenter = winStripIndex * stride + CASE_ITEM_WIDTH_PX / 2 + jitter;
  return marker - winCenter;
}

/** Offset para preview estático: centra un índice de carta bajo el marcador. */
export function computeReelPreviewOffset(frameWidthPx: number, centerStripIndex: number): number {
  const stride = caseItemStride();
  const marker = frameWidthPx / 2;
  const itemCenter = centerStripIndex * stride + CASE_ITEM_WIDTH_PX / 2;
  return marker - itemCenter;
}

export function buildReelStripItems<T>(
  pool: T[],
  winner: T,
  pickRandom: () => T,
  count = REEL_STRIP_COUNT,
  winIndex = REEL_WIN_STRIP_INDEX,
): T[] {
  const items: T[] = [];
  for (let i = 0; i < count; i += 1) {
    items.push(i === winIndex ? winner : pickRandom());
  }
  return items;
}

/** @deprecated MysteryBox — keyframes framer; cofres usan rAF + reelEase. */
export function buildCaseReelKeyframes(
  winIndex: number,
  itemCount: number,
  options?: { minFullLoops?: number; viewportCenterPx?: number },
): { x: number[]; times: number[]; durationS: number } {
  const stride = caseItemStride();
  const loops = options?.minFullLoops ?? 3;
  const center = options?.viewportCenterPx ?? 160;

  const oneLoop = itemCount * stride;
  const winSlot = loops * itemCount + winIndex;
  const finalX = -(winSlot * stride) + center - CASE_ITEM_WIDTH_PX / 2;
  const afterFullPass = -(oneLoop * 1.05);
  const midDecel = finalX + stride * 0.35;

  return {
    x: [0, afterFullPass, midDecel, finalX + stride * 0.08, finalX],
    times: [0, 0.22, 0.72, 0.94, 1],
    durationS: REEL_SPIN_DURATION_MS / 1000,
  };
}
