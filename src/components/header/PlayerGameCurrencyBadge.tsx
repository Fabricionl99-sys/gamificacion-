import { Coins } from 'lucide-react';

export function PlayerGameCurrencyBadge({ currencyCode }: { currencyCode: string }) {
  const code = currencyCode.trim().toUpperCase();
  if (!code) return null;

  return (
    <span
      className="inline-flex w-fit items-center gap-1 rounded-full border border-accent/35 bg-accent/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent"
      title={`Tu moneda de juego: ${code}`}
    >
      <Coins className="h-3 w-3 shrink-0" aria-hidden strokeWidth={2.25} />
      {code}
    </span>
  );
}
