import { User } from 'lucide-react';
import { cn } from '../../utils/classnames';

export interface AvatarProps {
  initials?: string;
  imageUrl?: string | null;
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  locked?: boolean;
  status?: 'online' | 'offline';
  className?: string;
}

const sizeClass: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-20 w-20 text-xl',
};

export function Avatar({ initials, imageUrl, label, size = 'md', locked = false, status, className }: AvatarProps) {
  return (
    <div
      aria-label={label ?? initials ?? 'avatar'}
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border-default bg-[radial-gradient(circle_at_30%_20%,var(--accent-subtle),var(--avatar-blue-glow)_45%,var(--avatar-surface-glow))] font-semibold text-text-primary shadow-card',
        sizeClass[size],
        className,
      )}
    >
      {imageUrl ? (
        <img alt="" className="h-full w-full object-cover" src={imageUrl} />
      ) : initials ? (
        initials
      ) : (
        <User aria-hidden className="h-4 w-4 text-text-secondary" />
      )}
      {locked ? (
        <span className="absolute -bottom-1 -right-1 rounded-full border border-border-default bg-bg-elevated px-1 text-metadata text-text-secondary">
          lock
        </span>
      ) : null}
      {status === 'online' ? (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-bg-primary bg-accent" />
      ) : null}
    </div>
  );
}
