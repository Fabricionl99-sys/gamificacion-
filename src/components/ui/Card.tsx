import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';

import { cn } from '../../utils/classnames';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated' | 'neon';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingMap: Record<NonNullable<CardProps['padding']>, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

const variantMap: Record<NonNullable<CardProps['variant']>, string> = {
  default: 'border border-border-default bg-bg-secondary shadow-card',
  glass: 'card-glass shadow-card',
  elevated: 'border border-border-default bg-bg-elevated shadow-modal',
  neon: 'card-neon-rim bg-bg-secondary shadow-card',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg', variantMap[variant], paddingMap[padding], className)}
      {...props}
    />
  ),
);

Card.displayName = 'Card';
