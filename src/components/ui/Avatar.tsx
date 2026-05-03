import { User } from 'lucide-react';
import { cn } from '../../utils/classnames';

export interface AvatarProps {
  initials?: string;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  locked?: boolean;
  className?: string;
}

const sizeClass: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-20 w-20 text-xl',
};

export function Avatar({ initials, label, size = 'md', locked = false, className }: AvatarProps) {
  return (
    <div
      aria-label={label}
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-full border border-border-default bg-[radial-gradient(circle_at_30%_20%,rgba(10,247,132,0.22),rgba(77,159,255,0.12)_45%,rgba(30,37,47,0.9))] font-semibold text-text-primary shadow-card',
        sizeClass[size],
        className,
      )}
    >
      {initials ? initials : <User aria-hidden className="h-4 w-4 text-text-secondary" />}
      {locked ? (
        <span className="absolute -bottom-1 -right-1 rounded-full border border-border-default bg-bg-elevated px-1 text-xs text-text-secondary">
          lock
        </span>
      ) : null}
    </div>
  );
}
