import type { HTMLAttributes } from 'react';

import { cn } from '../../utils/classnames';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'vip';
  variant?: 'default' | BadgeProps['tone'];
}

const toneClasses: Record<NonNullable<BadgeProps['tone']>, string> = {
  neutral: 'border-border-default bg-bg-tertiary text-text-secondary',
  accent: 'border-border-accent bg-accent/10 text-text-primary',
  success: 'border-border-accent bg-accent/10 text-accent',
  warning: 'border-warning/30 bg-warning/10 text-warning',
  danger: 'border-danger/30 bg-danger/10 text-danger',
  info: 'border-info/30 bg-info/10 text-info',
  vip: 'border-coins/40 bg-coins/10 text-coins',
};

export function Badge({ className, tone, variant, ...props }: BadgeProps) {
  const resolvedTone = tone ?? (variant === 'default' ? 'neutral' : variant) ?? 'neutral';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-sm border px-2 py-1 text-xs font-medium uppercase tracking-widest',
        toneClasses[resolvedTone],
        className,
      )}
      {...props}
    />
  );
}
