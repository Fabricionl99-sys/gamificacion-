import { useEffect, type ReactNode } from 'react';

import { useBrandingStore } from '../store/brandingStore';

export function BrandingBootstrap({ children }: { children: ReactNode }) {
  const status = useBrandingStore((s) => s.status);
  const load = useBrandingStore((s) => s.load);

  useEffect(() => {
    void load();
  }, [load]);

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg-primary text-text-secondary">
        <p className="text-sm">Cargando experiencia…</p>
      </div>
    );
  }

  return <>{children}</>;
}
