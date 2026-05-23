import { Users } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { Tournament } from '../../types/tournament';
import { useModalsStore } from '../../store/modalsStore';

interface TournamentCardProps {
  tournament: Tournament;
  onAction?: () => void;
}

const statusMap: Record<Tournament['status'], { label: string; tone: 'warning' | 'info' | 'danger' | 'neutral'; action: string }> = {
  live: { label: 'EN VIVO', tone: 'warning', action: 'ver detalle' },
  open: { label: 'ABIERTO', tone: 'info', action: 'inscribirme' },
  vip: { label: 'VIP+', tone: 'neutral', action: 'requiere VIP plata' },
  almostFull: { label: 'CASI LLENO', tone: 'danger', action: 'inscribirme' },
  finished: { label: 'FINALIZADO', tone: 'neutral', action: 'ver resultados' },
};

export function TournamentCard({ tournament, onAction }: TournamentCardProps) {
  const openModal = useModalsStore((state) => state.openModal);
  // Defensive fallback: si llega un status que no está en el map (ej. backend
  // manda 'active' sin que el adapter lo transforme), evitamos crash en
  // `status.tone` y renderizamos como 'open'. Antes esto crasheaba el Home
  // tab entero. Ver chip "Realinear cliente Predicciones" para fix completo
  // de shapes backend→widget.
  const status = statusMap[tournament.status] ?? statusMap.open;
  const isDisabled = tournament.status === 'vip';

  return (
    <Card className={isDisabled ? 'opacity-60' : undefined}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge tone={status.tone}>{status.label}</Badge>
          <h3 className="mt-2 text-md font-semibold text-text-primary">{tournament.name}</h3>
          <p className="mt-1 text-sm text-text-secondary">{tournament.description}</p>
        </div>
        <p className="text-right text-lg font-semibold text-coins">{tournament.prizePool}</p>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-module-body text-text-tertiary">
        <span>{tournament.endsIn ?? tournament.startsIn ?? 'proximo'}</span>
        <span className="flex items-center gap-1">
          <Users className="h-3 w-3" /> {tournament.participants}/{tournament.capacity}
        </span>
        <span>{tournament.myPosition ? `#${tournament.myPosition}` : tournament.vipRequired ?? 'abierto'}</span>
      </div>
      <Button
        className="mt-4 w-full"
        disabled={isDisabled}
        onClick={onAction ?? (() => openModal('tournamentRegister'))}
        variant={tournament.status === 'open' || tournament.status === 'almostFull' ? 'primary' : 'secondary'}
      >
        {status.action}
      </Button>
    </Card>
  );
}
