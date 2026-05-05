import type { XPBoost } from '../../types/boost';
import type { ToastInput } from '../../hooks/useToast';

export function pushBoostToast(pushToast: (input: ToastInput) => void, baseXp: number, boost: XPBoost) {
  const totalXp = baseXp * boost.multiplier;
  pushToast({
    tone: 'success',
    title: `+${totalXp} XP`,
    message: `x${boost.multiplier} boost activo · gracias por jugar`,
  });
}
