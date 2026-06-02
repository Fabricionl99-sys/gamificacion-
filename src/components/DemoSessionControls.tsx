import { useState } from 'react';
import { LogOut, UserRoundPlus } from 'lucide-react';

import { useToast } from '../hooks/useToast';
import { useAuthStore } from '../store/authStore';
import { Button } from './ui/Button';

const isLiveDemo = import.meta.env.VITE_USE_MOCKS === 'false';

export function isDemoSessionControlsEnabled(): boolean {
  return isLiveDemo;
}

export function DemoSessionControls({ compact = false }: { compact?: boolean }) {
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const startNewDemoPlayer = useAuthStore((s) => s.startNewDemoPlayer);

  if (!isLiveDemo) return null;

  const handleNewPlayer = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const session = await startNewDemoPlayer();
      toast.success(`Nuevo jugador demo: ${session.external_player_id}`);
      window.setTimeout(() => window.location.reload(), 1200);
    } catch {
      toast.danger('No pudimos iniciar una sesión demo nueva');
      setBusy(false);
      void useAuthStore.getState().ensureSession();
    }
  };

  if (compact) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        leftIcon={<UserRoundPlus className="h-3.5 w-3.5" aria-hidden />}
        disabled={busy}
        onClick={() => void handleNewPlayer()}
      >
        {busy ? 'Cambiando…' : 'Nuevo jugador demo'}
      </Button>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-border-default bg-bg-secondary/60 p-4">
      <div className="flex items-start gap-3">
        <LogOut className="mt-0.5 h-5 w-5 shrink-0 text-text-tertiary" aria-hidden />
        <div className="min-w-0 flex-1 space-y-1">
          <h2 className="text-md font-semibold text-text-primary">Sesión demo</h2>
          <p className="text-sm text-text-secondary">
            Cambiá de jugador para probar distintos external_player_id en pruebas E2E.
          </p>
        </div>
      </div>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="w-full"
        leftIcon={<UserRoundPlus className="h-4 w-4" aria-hidden />}
        disabled={busy}
        onClick={() => void handleNewPlayer()}
      >
        {busy ? 'Generando sesión…' : 'Probar con nuevo jugador'}
      </Button>
    </div>
  );
}
