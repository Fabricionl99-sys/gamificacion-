import { Rocket } from 'lucide-react';

import { useActiveBoosts } from '../../hooks/useActiveBoosts';
import { CATEGORY_LABELS } from '../../types/category';
import { formatTimeRemaining } from '../../utils/format';

export function BoostBadge() {
  const { boosts } = useActiveBoosts();
  if (boosts.length === 0) return null;

  const topBoost = boosts.reduce((best, boost) => (boost.multiplier > best.multiplier ? boost : best), boosts[0]);
  const scopeLabel = topBoost.scope === 'all' ? 'todas las categorías' : `solo ${CATEGORY_LABELS[topBoost.category_code ?? 'casino']}`;
  const tooltip = boosts
    .map((boost) => `${boost.name ?? boost.rule_name} · ${boost.scope === 'all' ? 'todas' : CATEGORY_LABELS[boost.category_code ?? 'casino']} · vence en ${formatTimeRemaining(boost.ends_at)}`)
    .join('\n');

  return (
    <span
      title={tooltip}
      className="inline-flex animate-[pulse_3s_ease-in-out_infinite] items-center gap-1 rounded-full border border-accent/30 bg-accent-subtle px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-accent shadow-glow"
    >
      <Rocket className="h-3 w-3" />
      x{topBoost.multiplier} ACTIVO · {scopeLabel}
    </span>
  );
}
