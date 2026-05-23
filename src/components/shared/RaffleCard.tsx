import { Trophy } from 'lucide-react';

import type { Raffle } from '../../types/raffle';
import { CurrencyCostLine } from './CurrencyCostLine';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface RaffleCardProps {
  raffle: Raffle;
  onOpen: (raffle: Raffle) => void;
}

export function RaffleCard({ raffle, onOpen }: RaffleCardProps) {
  const disabled = raffle.status === 'drawing';

  return (
    <Card className="overflow-hidden">
      <div className="flex gap-3">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
          {raffle.imageUrl ? (
            <img src={raffle.imageUrl} alt="" className="h-full w-full rounded-lg object-cover" />
          ) : (
            <Trophy className="h-7 w-7" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-text-primary">{raffle.name}</h3>
            {disabled ? <Badge tone="warning">Sorteando…</Badge> : null}
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{raffle.description}</p>
          {raffle.mainPrizeLabel ? (
            <p className="mt-1 text-xs text-text-tertiary">Premio: {raffle.mainPrizeLabel}</p>
          ) : null}
          <CurrencyCostLine
            currencyId={raffle.entryCostCurrencyId}
            currencyCode={raffle.entryCostCurrencyCode}
            currencyName={raffle.entryCostCurrencyName}
            amount={raffle.entryCostAmount}
          />
          <p className="text-xs text-text-tertiary">Cierra en {raffle.closesIn ?? '—'}</p>
        </div>
      </div>
      <Button className="mt-3 w-full" variant="secondary" disabled={disabled} onClick={() => onOpen(raffle)}>
        Ver más
      </Button>
    </Card>
  );
}
