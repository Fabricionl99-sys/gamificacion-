import { Bell, Trophy, Users } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { tabEmptyStates } from './emptyStateConfig';

export function RankingEmptyState() {
  return (
    <EmptyState
      icon={<Trophy className="h-8 w-8" />}
      title="tu primera semana en el ranking"
      description="competi por XP para subir"
    />
  );
}

export function FollowingFeedEmptyState() {
  return (
    <EmptyState
      icon={<Users className="h-8 w-8" />}
      title="todavia no seguis a nadie"
      description="anda a explorar para encontrar gente"
    />
  );
}

export function ExploreFeedEmptyState() {
  return (
    <EmptyState
      icon={<Users className="h-8 w-8" />}
      title="no hay novedades para explorar"
      description="volvé más tarde o seguí a más jugadores"
    />
  );
}

export function NotificationsEmptyState() {
  return (
    <EmptyState
      icon={<Bell className="h-8 w-8" />}
      title="todavia no tenes notificaciones"
      description="vamos a avisarte cuando suba algo"
    />
  );
}

export function MissionsEmptyState() {
  return <EmptyState {...tabEmptyStates.missions} />;
}

export function ShopEmptyState() {
  return <EmptyState {...tabEmptyStates.shop} />;
}

export function TournamentEmptyState() {
  return (
    <EmptyState
      icon={<Trophy className="h-8 w-8" />}
      title="no hay torneos disponibles"
      description="segui jugando para ganar XP"
    />
  );
}
