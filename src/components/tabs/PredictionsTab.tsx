import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock, Coins, Trophy, XCircle } from 'lucide-react';

import { getPredictionEvent, getPredictionEvents, submitPrediction } from '../../api/predictions';
import { useAsyncData } from '../../hooks/useAsyncData';
import { useWidgetNavigation } from '../../hooks/useWidgetNavigation';
import type { PredictionEvent, PredictionItem, PredictionMarket } from '../../types/prediction';
import { formatCompactNumber, formatNumber, formatTimeRemaining } from '../../utils/format';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { Modal } from '../ui/Modal';
import { Skeleton } from '../ui/Skeleton';
import { SectionHeader } from '../shared/SectionHeader';

type Tab = 'active' | 'my' | 'past';
type Picks = Record<string, string>;

const sportEmoji: Record<PredictionEvent['sport'], string> = {
  football: '⚽',
  tennis: '🎾',
  basketball: '🏀',
  ufc: '🥊',
  other: '🎯',
};

const marketLabels: Record<PredictionMarket, string> = {
  result_1x2: 'Resultado 1X2',
  winner_2options: 'Ganador',
  total_goals: 'Total goles',
  total_corners: 'Total corners',
  both_score: 'Ambos marcan',
  exact_score: 'Resultado exacto',
};

const optionLabels: Record<PredictionMarket, { value: string; label: string }[]> = {
  result_1x2: [
    { value: 'option1', label: 'Local' },
    { value: 'draw', label: 'Empate' },
    { value: 'option2', label: 'Visitante' },
  ],
  winner_2options: [
    { value: 'option1', label: 'Opción 1' },
    { value: 'option2', label: 'Opción 2' },
  ],
  total_goals: [
    { value: 'over', label: 'Más 2.5' },
    { value: 'under', label: 'Menos 2.5' },
  ],
  total_corners: [
    { value: 'over', label: 'Más 9.5' },
    { value: 'under', label: 'Menos 9.5' },
  ],
  both_score: [
    { value: 'yes', label: 'Sí' },
    { value: 'no', label: 'No' },
  ],
  exact_score: ['1-0', '1-1', '2-0', '2-1', '2-2', '3-1', 'otro'].map((value) => ({ value, label: value })),
};

export default function PredictionsTab() {
  const [tab, setTab] = useState<Tab>('active');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { route, openDetail, closeDetail } = useWidgetNavigation();
  const { data: events = [], isLoading, error } = useAsyncData(() => getPredictionEvents(tab), [], [tab]);
  const selected = useAsyncData(() => (selectedId ? getPredictionEvent(selectedId) : Promise.resolve(null)), null, [selectedId]);

  const detailId = route.tab === 'predictions' ? route.detailId : undefined;

  useEffect(() => {
    if (!detailId) {
      setSelectedId(null);
      return;
    }
    setSelectedId(detailId);
  }, [detailId]);

  useEffect(() => {
    if (!detailId || isLoading) return;
    const exists = events.some((event) => event.id === detailId);
    if (exists) return;
    void getPredictionEvent(detailId).then((event) => {
      if (!event) closeDetail('predictions');
    });
  }, [detailId, events, isLoading, closeDetail]);

  const tabs = [
    { id: 'active', label: `Activos · ${tab === 'active' ? events.length : 4}` },
    { id: 'my', label: `Mis predicciones · ${tab === 'my' ? events.length : 2}` },
    { id: 'past', label: `Pasados · ${tab === 'past' ? events.length : 12}` },
  ] as const;

  return (
    <div className="space-y-4">
      <SectionHeader
        eyebrow="Predicciones"
        title="ganá monedas prediciendo resultados"
        description="Elegí tus picks antes del cierre y competí por premio pleno."
      />

      <div className="grid grid-cols-3 gap-2 rounded-lg bg-bg-secondary p-1">
        {tabs.map((item) => (
          <Button
            key={item.id}
            size="sm"
            className="text-submenu"
            variant={tab === item.id ? 'primary' : 'ghost'}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : error ? (
        <EmptyState icon={<Trophy className="h-8 w-8" />} title="No pudimos cargar predicciones" description="Intentá de nuevo en unos segundos." />
      ) : events.length === 0 ? (
        <EmptyState icon={<Trophy className="h-8 w-8" />} title="No hay predicciones" description="Cuando el operador publique eventos los vas a ver acá." />
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} mode={tab} onOpen={() => openDetail('predicciones', event.id)} />
          ))}
        </div>
      )}

      <PredictionDetailModal event={selected.data} onClose={() => closeDetail('predictions')} readonly={tab !== 'active'} />
    </div>
  );
}

function EventCard({ event, mode, onOpen }: { event: PredictionEvent; mode: Tab; onOpen: () => void }) {
  // Defensive: backend `/v1/player/predictions` (list) no incluye `items` —
  // viven en el detail endpoint. Si items es undefined/[], renderizamos card
  // sin la lógica de "predicho/aciertos" en vez de crashear con .every().
  const items = event.items ?? [];
  const predicted = items.length > 0 && items.every((item) => item.player_prediction);
  const hits = items.filter((item) => item.result && item.player_prediction === item.result).length;
  const emoji = sportEmoji[event.sport] ?? sportEmoji.other;

  return (
    <Card className="overflow-hidden">
      <div className="flex gap-3">
        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-accent-subtle text-4xl">{emoji}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-text-primary">{event.name}</h3>
            {predicted ? <Badge tone="success">predicho</Badge> : null}
          </div>
          <p className="mt-1 text-sm text-text-secondary">{event.description}</p>
          <p className="mt-2 text-xs text-text-tertiary">
            {items.length} items · {formatNumber(event.participants_count)} jugadores · pool {formatCompactNumber(event.pool_accumulated)}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <Badge tone={event.status === 'past' ? 'neutral' : 'info'}>
          <Clock className="h-3 w-3" />
          {event.status === 'past' ? `${hits}/${event.items.length} aciertos` : `cierra en ${formatTimeRemaining(event.closes_at)}`}
        </Badge>
        <Button size="sm" variant="primary" onClick={onOpen}>
          {mode === 'past' ? 'ver detalle' : predicted ? 'Ver mis predicciones' : 'Predecir →'}
        </Button>
      </div>
    </Card>
  );
}

function PredictionDetailModal({
  event,
  onClose,
  readonly,
}: {
  event: PredictionEvent | null | undefined;
  onClose: () => void;
  readonly: boolean;
}) {
  const [picks, setPicks] = useState<Picks>({});
  const [submitted, setSubmitted] = useState(false);
  const effectivePicks = useMemo(
    () => Object.fromEntries((event?.items ?? []).map((item) => [item.id, item.player_prediction ?? picks[item.id] ?? ''])),
    [event?.items, picks],
  );

  if (!event) return null;
  const completed = Object.values(effectivePicks).filter(Boolean).length;
  const canSubmit = completed === event.items.length && !readonly;
  const earned = event.items.reduce((sum, item) => (item.result && item.player_prediction === item.result ? sum + item.prize_amount : sum), 0);

  const confirm = async () => {
    if (!canSubmit) return;
    await submitPrediction(event.id, effectivePicks);
    setSubmitted(true);
  };

  return (
    <Modal isOpen onClose={onClose} title={event.name} description={`${event.items.length} items · cierra en ${formatTimeRemaining(event.closes_at)}`}>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <Stat label="items" value={`${event.items.length}/15`} />
          <Stat label="pool" value={formatNumber(event.pool_accumulated)} />
          <Stat label="participantes" value={formatNumber(event.participants_count)} />
        </div>

        {event.entry_cost > 0 ? (
          <div className="rounded-md border border-coins/30 bg-coins/10 p-3 text-xs text-coins">
            Costo de entrada: {formatNumber(event.entry_cost)} monedas. Se confirma al enviar.
          </div>
        ) : null}

        {event.items.map((item) => (
          <PredictionItemCard
            key={item.id}
            item={item}
            selected={effectivePicks[item.id]}
            readonly={readonly || submitted}
            onSelect={(value) => setPicks((current) => ({ ...current, [item.id]: value }))}
          />
        ))}

        <Card className="border-coins/40 bg-coins/10">
          <div className="flex items-center gap-2 text-coins">
            <Coins className="h-4 w-4" />
            <span className="font-semibold">Premio pleno: {formatNumber(event.grand_prize_amount)} monedas</span>
          </div>
        </Card>

        {event.status === 'past' ? (
          <Card className="bg-accent-subtle text-sm">
            Premio ganado: <b className="text-accent">{formatNumber(earned)} monedas</b>
          </Card>
        ) : null}

        {!readonly ? (
          <Button className="w-full" variant="primary" disabled={!canSubmit || submitted} onClick={confirm}>
            {submitted ? 'predicción enviada' : `Confirmar predicción (${completed}/${event.items.length} items completados)`}
          </Button>
        ) : null}
      </div>
    </Modal>
  );
}

function PredictionItemCard({
  item,
  selected,
  readonly,
  onSelect,
}: {
  item: PredictionItem;
  selected?: string;
  readonly: boolean;
  onSelect: (value: string) => void;
}) {
  return (
    <Card className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold">
            #{item.position} {item.name}
          </p>
          <p className="text-xs text-text-tertiary">{marketLabels[item.market]} · premio +{formatNumber(item.prize_amount)}</p>
        </div>
        {item.result ? (
          selected === item.result ? <CheckCircle2 className="h-5 w-5 text-accent" /> : <XCircle className="h-5 w-5 text-danger" />
        ) : null}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {optionLabels[item.market].map((option) => {
          const active = selected === option.value;
          return (
            <button
              key={option.value}
              type="button"
              disabled={readonly}
              onClick={() => onSelect(option.value)}
              className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
                active ? 'border-accent bg-accent-subtle text-accent shadow-glow' : 'border-border-default bg-bg-tertiary text-text-secondary'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {item.result ? <p className="text-xs text-text-tertiary">Resultado real: {item.result}</p> : null}
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-bg-tertiary p-2">
      <p className="text-[10px] uppercase text-text-tertiary">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
