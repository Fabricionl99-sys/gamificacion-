export type WidgetEventMap = {
  postPublished: { postId: string; pendingReview: boolean };
  betCopied: { postId: string; pickId: string; teams: string; prediction: string; odds: number };
};

export function emitWidgetEvent<K extends keyof WidgetEventMap>(
  event: K,
  payload: WidgetEventMap[K],
): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(`wingoat:${event}`, { detail: payload }));
  }
}
