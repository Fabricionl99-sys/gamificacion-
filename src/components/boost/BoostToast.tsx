import { useEffect } from 'react';

import { useActiveBoosts } from '../../hooks/useActiveBoosts';
import { useToast } from '../../hooks/useToast';
import type { XPBoost } from '../../types/boost';
import { pushBoostToast } from './boostToastHelpers';

export function BoostToast({ baseXP, multiplier }: { baseXP: number; multiplier: XPBoost['multiplier'] }) {
  return (
    <div role="status" className="rounded-lg border border-accent/30 bg-bg-elevated p-4 shadow-modal">
      <p className="text-2xl font-black text-accent">+{baseXP * multiplier} XP</p>
      <p className="mt-1 text-sm text-text-secondary">x{multiplier} boost activo · gracias por jugar</p>
    </div>
  );
}

export function BoostToastTrigger() {
  const { boosts } = useActiveBoosts();
  const pushToast = useToast((state) => state.pushToast);

  useEffect(() => {
    const boost = boosts[0];
    if (!boost) return;
    const timer = window.setTimeout(() => pushBoostToast(pushToast, 100, boost), 700);
    return () => window.clearTimeout(timer);
  }, [boosts, pushToast]);

  return null;
}
