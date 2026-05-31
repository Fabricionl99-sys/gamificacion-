import type { CSSProperties } from 'react';
import { cn } from '../../utils/classnames';

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  ariaLabel?: string;
  className?: string;
  tone?: 'accent' | 'warning' | 'danger' | 'info' | 'coins';
}

const toneClass: Record<NonNullable<ProgressBarProps['tone']>, string> = {
  accent: 'bg-accent',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
  coins: 'bg-coins',
};

const toneStyle: Partial<Record<NonNullable<ProgressBarProps['tone']>, CSSProperties>> = {
  accent: { background: 'var(--progress-fill, var(--accent-primary))' },
};

export function ProgressBar({ value, max = 100, label, ariaLabel, className, tone = 'accent' }: ProgressBarProps) {
  const progress = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div className={cn('space-y-1', className)}>
      {label ? <p className="text-metadata text-text-tertiary">{label}</p> : null}
      <div
        className="h-1 overflow-hidden rounded-full"
        style={{ background: 'var(--progress-track, var(--bg-tertiary))' }}
        aria-label={ariaLabel ?? label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        role="progressbar"
      >
        <div
          className={cn('h-full rounded-full transition-all duration-500', tone === 'accent' ? '' : toneClass[tone])}
          style={{ width: `${progress}%`, ...(toneStyle[tone] ?? {}) }}
        />
      </div>
    </div>
  );
}
