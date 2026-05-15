export type WidgetEventMap = {
  postPublished: { postId: string; pendingReview: boolean };
  betCopied: {
    postId: string;
    pickId: string;
    teams: string;
    prediction: string;
    odds: number;
    totalOdds?: number;
    legs?: { teams: string; prediction: string; odds: number }[];
    bookingCode?: string;
  };
  missionNavigate: { missionId: string; category: string; ruleId?: string };
  missionClaimed: { missionId: string; rewardXP: number; rewardCoins: number };
};

export function emitWidgetEvent<K extends keyof WidgetEventMap>(
  event: K,
  payload: WidgetEventMap[K],
): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(`wingoat:${event}`, { detail: payload }));
  }
}
