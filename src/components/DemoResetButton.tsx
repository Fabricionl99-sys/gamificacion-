import { useState } from 'react';

import { resetDemoSession } from '../api/demoSession';
import { useAuthStore } from '../store/authStore';

const useMocks = import.meta.env.VITE_USE_MOCKS !== 'false';

export function DemoResetButton() {
  const [busy, setBusy] = useState(false);
  const clearSession = useAuthStore((s) => s.clearSession);

  if (useMocks) return null;

  const handleReset = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await resetDemoSession();
      clearSession();
      window.location.reload();
    } catch {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      className="text-[11px] text-text-muted underline-offset-2 hover:text-text-secondary hover:underline disabled:opacity-50"
      disabled={busy}
      onClick={() => void handleReset()}
    >
      {busy ? 'Reiniciando…' : 'Reiniciar demo'}
    </button>
  );
}
