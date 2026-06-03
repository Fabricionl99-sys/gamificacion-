import type { MissionRequirement } from '../types/mission';
import { formatNumber } from './format';

const CATEGORY_LABELS: Record<string, string> = {
  casino: 'casino',
  deportes: 'deportes',
  sports: 'deportes',
  slots: 'slots',
  live: 'casino en vivo',
  poker: 'poker',
  virtuales: 'virtuales',
};

function categoryLabel(slug: string): string {
  return CATEGORY_LABELS[slug] ?? slug.replace(/_/g, ' ');
}

function money(amount: number, currencyCode?: string): string {
  const code = currencyCode?.trim();
  return code ? `$${formatNumber(amount)} ${code}` : `$${formatNumber(amount)}`;
}

export function formatMissionActionLabel(config: Record<string, unknown>): string {
  const type = String(config.type ?? 'login');
  const amount = Number(config.amount ?? 0);
  const currencyCode = config.currency_code != null ? String(config.currency_code) : undefined;
  const categorySlug = config.category_slug != null ? String(config.category_slug) : '';
  const count = Number(config.count ?? 0);
  const minAmount = Number(config.min_amount ?? 0);

  switch (type) {
    case 'bet_amount':
      return `Apostar ${money(amount, currencyCode)}`;
    case 'deposit_amount':
      return `Depositar ${money(amount, currencyCode)}`;
    case 'bet_category':
      return amount > 0
        ? `Apostar $${formatNumber(amount)} en ${categoryLabel(categorySlug)}`
        : `Apostar en ${categoryLabel(categorySlug)}`;
    case 'cumulative_bets':
      return `${formatNumber(count)} apuestas`;
    case 'login':
      return 'Iniciar sesión';
    case 'first_deposit':
      return minAmount > 0 ? `Hacer primer depósito ≥ $${formatNumber(minAmount)}` : 'Hacer primer depósito';
    case 'verify_email':
      return 'Verificar email';
    case 'verify_kyc':
      return 'Verificar identidad (KYC)';
    case 'verify_phone':
      return 'Verificar teléfono';
    default:
      return type.replace(/_/g, ' ');
  }
}

export interface BackendMissionActionRow {
  id?: string;
  type?: string;
  config?: Record<string, unknown>;
  current_value?: number;
  target_value?: number;
  is_complete?: boolean;
  progress?: number;
  progress_current?: number;
  target?: number;
  progress_target?: number;
}

export function adaptMissionRequirement(raw: BackendMissionActionRow): MissionRequirement {
  const config = (raw.config ?? {}) as Record<string, unknown>;
  if (!config.type && raw.type) config.type = raw.type;

  const currentValue = Number(raw.current_value ?? raw.progress ?? raw.progress_current ?? 0);
  const targetValue = Number(raw.target_value ?? raw.target ?? raw.progress_target ?? 0);
  const isComplete = Boolean(
    raw.is_complete ?? (targetValue > 0 ? currentValue >= targetValue : currentValue > 0),
  );

  return {
    id: String(raw.id ?? `${String(config.type ?? 'action')}-${currentValue}-${targetValue}`),
    label: formatMissionActionLabel(config),
    currentValue,
    targetValue,
    isComplete,
    showProgress: targetValue > 1,
  };
}
