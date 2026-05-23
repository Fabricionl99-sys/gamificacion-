import { useEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink, Lock } from 'lucide-react';

import {
  enterRaffle,
  getRaffleDetail,
  ticketRangeLabel,
  winChancePercent,
} from '../../api/raffles';
import { formatCurrencyCost, resolveRaffleCurrency } from '../../api/currencies';
import { useAsyncData } from '../../hooks/useAsyncData';
import { useCurrencies } from '../../hooks/useCurrencies';
import { usePlayer } from '../../hooks/usePlayer';
import { useToast } from '../../hooks/useToast';
import type { Raffle } from '../../types/raffle';
import { formatNumber } from '../../utils/format';
import { Button } from '../ui/Button';
import { CurrencyCostLine } from '../shared/CurrencyCostLine';
import { Modal } from '../ui/Modal';
import { Skeleton } from '../ui/Skeleton';

interface RaffleDetailModalProps {
  raffle: Raffle | null;
  tenantId?: string;
  autoFocusBuy?: boolean;
  onClose: () => void;
  onEntered?: () => void;
}

export function RaffleDetailModal({ raffle, tenantId, autoFocusBuy = false, onClose, onEntered }: RaffleDetailModalProps) {
  const toast = useToast();
  const { player } = usePlayer();
  const [buyCount, setBuyCount] = useState(1);
  const [busy, setBusy] = useState(false);
  const [detailRefresh, setDetailRefresh] = useState(0);
  const buySectionRef = useRef<HTMLDivElement>(null);

  const code = raffle?.code ?? '';
  const open = Boolean(raffle);
  const { data: detail, isLoading, error } = useAsyncData(
    async () => {
      if (!open || !code) return undefined;
      return getRaffleDetail(code);
    },
    undefined,
    [open, code, detailRefresh],
  );

  const gemBalance = useMemo(() => {
    const wallet = player.wallet ?? [];
    if (!detail) return player.coins;
    const match = resolveRaffleCurrency(wallet, detail);
    return match?.balance ?? player.coins;
  }, [player, detail]);

  const { currencies } = useCurrencies();
  const entryCurrency = detail ? resolveRaffleCurrency(currencies, detail) : undefined;
  const entryCostText = detail ? formatCurrencyCost(detail.entryCostAmount, entryCurrency) : raffle?.entryCostLabel ?? '';
  const totalCost = (detail?.entryCostAmount ?? 0) * buyCount;
  const totalCostLabel = formatCurrencyCost(totalCost, entryCurrency);
  const canEnter =
    detail &&
    detail.status === 'open' &&
    !busy &&
    (detail.maxEntriesPerPlayer === 0 || detail.myEntriesCount + buyCount <= detail.maxEntriesPerPlayer);

  useEffect(() => {
    if (!autoFocusBuy || !detail || detail.status !== 'open') return;
    buySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [autoFocusBuy, detail]);

  const verifyUrl =
    tenantId && detail
      ? `https://api.social2game.com/v1/public/raffles/${tenantId}/${detail.code}/verify`
      : null;

  const handleBuy = async () => {
    if (!detail || !canEnter) return;
    if (totalCost > gemBalance) {
      toast.danger('Saldo insuficiente · conseguí más gemas en misiones');
      return;
    }
    if (detail.maxEntriesPerPlayer > 0 && detail.myEntriesCount + buyCount > detail.maxEntriesPerPlayer) {
      toast.danger(`Máximo ${detail.maxEntriesPerPlayer} entradas por jugador`);
      return;
    }
    setBusy(true);
    try {
      const result = await enterRaffle(detail.code, buyCount);
      toast.success(`Compraste ${result.entries} entradas (${ticketRangeLabel(result.ticketNumbers)})`);
      setDetailRefresh((k) => k + 1);
      onEntered?.();
    } catch (e) {
      const msg = e instanceof Error ? e.message : '';
      toast.danger(msg.includes('409') || msg.toLowerCase().includes('saldo') ? 'Saldo insuficiente' : 'No pudimos comprar entradas');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal isOpen={Boolean(raffle)} onClose={onClose} title={raffle?.name ?? 'Sorteo'}>
      {open && isLoading ? <Skeleton className="h-40" /> : null}
      {open && error && !isLoading ? <p className="text-sm text-danger">No pudimos cargar el sorteo</p> : null}
      {detail ? (
        <div className="space-y-4">
          {detail.status === 'drawing' ? (
            <p className="rounded-lg bg-warning/10 px-3 py-2 text-sm text-warning">Sorteando ganadores…</p>
          ) : null}

          <CurrencyCostLine
            currencyId={detail.entryCostCurrencyId}
            currencyCode={detail.entryCostCurrencyCode}
            currencyName={detail.entryCostCurrencyName}
            amount={detail.entryCostAmount}
            className="flex items-center gap-2 text-sm font-medium text-accent"
          />

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-md bg-bg-tertiary p-3">
              <p className="text-text-tertiary">Mis entradas</p>
              <p className="font-semibold">{detail.myEntriesCount}</p>
              <p className="text-metadata text-text-secondary">{ticketRangeLabel(detail.myTicketNumbers)}</p>
            </div>
            <div className="rounded-md bg-bg-tertiary p-3">
              <p className="text-text-tertiary">Total / chance</p>
              <p className="font-semibold">{formatNumber(detail.totalEntries)} entradas</p>
              <p className="text-metadata text-accent">{winChancePercent(detail.myEntriesCount, detail.totalEntries)}</p>
            </div>
          </div>

          <p className="text-sm text-text-secondary">Cierra en {detail.closesIn ?? '—'}</p>

          <div className="rounded-lg border border-border-default bg-bg-secondary p-3 text-metadata">
            <p className="flex items-center gap-1 font-mono text-text-tertiary">
              <Lock className="h-3 w-3" /> Compromiso: {detail.commitment.slice(0, 12)}…
            </p>
            {verifyUrl ? (
              <a href={verifyUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-accent">
                Verificá vos mismo <ExternalLink className="h-3 w-3" />
              </a>
            ) : null}
          </div>

          {detail.prizes.length > 0 ? (
            <div>
              <p className="mb-2 text-sm font-semibold">Premios</p>
              <ul className="space-y-1 text-sm text-text-secondary">
                {detail.prizes.map((p) => (
                  <li key={p.position}>
                    #{p.position} · {p.label}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {detail.status === 'open' ? (
            <div ref={buySectionRef} className="space-y-2 border-t border-border-default pt-4">
              <label className="block text-sm">
                Cantidad de entradas
                <input
                  type="number"
                  min={1}
                  max={detail.maxEntriesPerPlayer > 0 ? Math.max(1, detail.maxEntriesPerPlayer - detail.myEntriesCount) : 99}
                  value={buyCount}
                  onChange={(e) => setBuyCount(Math.max(1, Number(e.target.value) || 1))}
                  className="mt-1 w-full rounded-md border border-border-default bg-bg-primary px-3 py-2"
                />
              </label>
              <p className="text-metadata text-text-tertiary">
                Total: {totalCostLabel} · Saldo: {formatNumber(gemBalance)}
              </p>
              <Button variant="primary" className="w-full" disabled={!canEnter} onClick={() => void handleBuy()}>
                {busy ? 'Comprando…' : `Comprar (${buyCount} × ${entryCostText} = ${totalCostLabel})`}
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </Modal>
  );
}
