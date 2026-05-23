/** Cálculo del carril horizontal estilo CS: una vuelta completa y frenado en el premio. */
export const CASE_ITEM_WIDTH_PX = 120;
export const CASE_ITEM_GAP_PX = 12;

export function caseItemStride(): number {
  return CASE_ITEM_WIDTH_PX + CASE_ITEM_GAP_PX;
}

/** Índice del ítem ganador en el arreglo `items` (server-side). */
export function buildCaseReelKeyframes(
  winIndex: number,
  itemCount: number,
  options?: { minFullLoops?: number; viewportCenterPx?: number },
): { x: number[]; times: number[]; durationS: number } {
  const stride = caseItemStride();
  const loops = options?.minFullLoops ?? 2;
  const center = options?.viewportCenterPx ?? 160;

  const oneLoop = itemCount * stride;
  const winSlot = loops * itemCount + winIndex;
  const finalX = -(winSlot * stride) + center - CASE_ITEM_WIDTH_PX / 2;
  const afterFullPass = -(oneLoop * 1.05);
  const midDecel = finalX + stride * 0.35;

  return {
    x: [0, afterFullPass, midDecel, finalX + stride * 0.08, finalX],
    times: [0, 0.22, 0.72, 0.94, 1],
    durationS: 5.2,
  };
}
