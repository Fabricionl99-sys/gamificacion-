import type { ReactNode } from 'react';

import { cn } from '../../utils/classnames';

interface PillProps {
  icon?: ReactNode;
  label: string;
  tone?: 'default' | 'streak' | 'coins' | 'accent' | 'danger';
  className?: string;
}

const tones: Record<NonNullable<PillProps['tone']>, string> = {
  default: 'bg-bg-tertiary text-text-primary',
  streak: 'bg-bg-tertiary text-text-primary [&_svg]:text-streak',
  coins: 'bg-bg-tertiary text-text-primary [&_svg]:text-coins',
  accent: 'bg-accent/10 text-text-primary ring-1 ring-accent/30',
  danger: 'bg-danger/10 text-text-primary ring-1 ring-danger/30',
};

export function Pill({ icon, label, tone = 'default', className }: PillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold leading-none',
        tones[tone],
        className,
      )}
    >
      {icon}
      {label}
    </span>
  );
}
