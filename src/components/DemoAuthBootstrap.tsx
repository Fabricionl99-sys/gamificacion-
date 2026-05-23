import { useEffect, type ReactNode } from 'react';

import { useAuthStore } from '../store/authStore';

const useMocks = import.meta.env.VITE_USE_MOCKS !== 'false';

export function DemoAuthBootstrap({ children }: { children: ReactNode }) {
  const status = useAuthStore((s) => s.status);
  const error = useAuthStore((s) => s.error);
  const ensureSession = useAuthStore((s) => s.ensureSession);

  useEffect(() => {
    if (useMocks) return;
    if (status === 'idle') void ensureSession();
  }, [ensureSession, status]);

  if (useMocks) return <>{children}</>;

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg-primary text-text-secondary">
        <p className="text-sm">Iniciando sesión demo…</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-bg-primary px-6 text-center text-text-primary">
        <p className="text-sm text-text-secondary">No pudimos conectar con el servidor demo.</p>
        {error ? <p className="text-metadata text-danger">{error}</p> : null}
        <button
          type="button"
          className="rounded-lg bg-accent-primary px-4 py-2 text-sm font-semibold text-bg-primary"
          onClick={() => void ensureSession()}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
