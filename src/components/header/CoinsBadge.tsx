import { Sparkles } from 'lucide-react';
import { formatNumber } from '../../utils/format';
import type { WalletCurrency } from '../../types/currency';

type Props = {
  wallet?: WalletCurrency[];
  /** fallback total when wallet not provided */
  coinsFallback?: number;
};

export function CoinsBadge({ wallet, coinsFallback }: Props) {
  if (wallet && wallet.length > 0) {
    return (
      <div className="flex flex-wrap items-center justify-end gap-1.5">
        {wallet.map((c) => (
          <span
            key={c.id}
            className="inline-flex max-w-[140px] items-center gap-1 rounded-full border border-border-default bg-bg-tertiary px-2 py-0.5 text-[11px] font-medium text-text-primary"
            title={c.name}
          >
            {c.imageUrl ? (
              <img src={c.imageUrl} alt="" className="h-5 w-5 shrink-0 rounded-full object-cover" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-coins" aria-hidden />
            )}
            <span className="truncate text-coins">{formatNumber(c.balance)}</span>
          </span>
        ))}
      </div>
    );
  }

  const total = coinsFallback ?? 0;
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border-default bg-bg-tertiary px-2 py-0.5 text-[11px] font-medium text-coins">
      <Sparkles className="h-3.5 w-3.5" aria-hidden />
      {formatNumber(total)}
    </span>
  );
}
