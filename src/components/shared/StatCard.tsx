import type { ReactNode } from 'react';

import { Card } from '../ui/Card';
import { cn } from '../../utils/classnames';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  tone?: 'default' | 'streak' | 'coins' | 'info';
}

const toneClass: Record<NonNullable<StatCardProps['tone']>, string> = {
  default: 'text-text-primary',
  streak: 'text-streak',
  coins: 'text-coins',
  info: 'text-info',
};

export function StatCard({ label, value, icon, tone = 'default' }: StatCardProps) {
  return (
    <Card padding="sm" className="text-center">
      <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-bg-tertiary text-text-secondary">
        {icon}
      </div>
      <p className={cn('text-lg font-semibold tracking-tight', toneClass[tone])}>{value}</p>
      <p className="text-xs text-text-tertiary">{label}</p>
    </Card>
  );
}
