import type { TabId } from '../types/navigation';

const PILOT_CONFIG = {
  /** Activar piloto Social por defecto. Desactivar en `false` al terminar la demo. */
  enabled: false,
  defaultTab: 'social' as TabId,
  /** Perfil público al iniciar para poder publicar sin ir a ajustes. */
  ensurePublicProfile: true,
  showBanner: true,
  /** Si es true, solo se muestra el tab Social en la navegación. */
  socialOnly: false,
} as const;

export function isPilotActive(): boolean {
  if (typeof window === 'undefined') return PILOT_CONFIG.enabled;
  const params = new URLSearchParams(window.location.search);
  if (params.get('pilot') === 'social' || params.get('pilot') === '1') return true;
  if (params.get('pilot') === '0') return false;
  return import.meta.env.VITE_PILOT_SOCIAL === 'true' || PILOT_CONFIG.enabled;
}

export const PILOT = {
  ...PILOT_CONFIG,
  isActive: isPilotActive,
};
