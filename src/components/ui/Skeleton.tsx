import { cn } from '../../utils/classnames';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-shimmer rounded-md bg-bg-tertiary', className)} aria-hidden="true" />;
}
