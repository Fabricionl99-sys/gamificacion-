import { Gem } from 'lucide-react';

import { formatCurrencyCost } from '../../api/currencies';
import { useRaffleCurrency } from '../../hooks/useCurrencies';

export function CurrencyCostLine({
  currencyId,
  currencyCode,
  currencyName,
  amount,
  suffix = 'por entrada',
  className = 'flex items-center gap-1 text-xs font-medium text-accent',
}: {
  currencyId: string;
  currencyCode?: string | null;
  currencyName?: string | null;
  amount: number;
  suffix?: string;
  className?: string;
}) {
  const { currency } = useRaffleCurrency({
    entryCostCurrencyId: currencyId,
    entryCostCurrencyCode: currencyCode,
    entryCostCurrencyName: currencyName,
  });
  const label = formatCurrencyCost(amount, currency);

  return (
    <p className={className}>
      {currency?.imageUrl ? (
        <img src={currency.imageUrl} alt="" className="h-3.5 w-3.5 rounded-full object-cover" />
      ) : (
        <Gem className="h-3.5 w-3.5" />
      )}
      {label}
      {suffix ? ` ${suffix}` : ''}
    </p>
  );
}
