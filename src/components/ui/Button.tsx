import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/classnames';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variants = {
  primary: 'bg-accent text-bg-primary shadow-glow hover:bg-accent-hover hover:shadow-glow-strong',
  secondary: 'border border-border-default bg-bg-tertiary text-text-primary hover:bg-bg-elevated',
  ghost: 'bg-transparent text-text-secondary hover:bg-bg-tertiary hover:text-text-primary',
  danger: 'bg-danger text-white hover:brightness-110',
};

const sizes = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
  icon: 'h-8 w-8 p-0',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      disabled,
      type = 'button',
      leftIcon,
      rightIcon,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0',
        !disabled && !isLoading && 'hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {isLoading ? <span className="h-4 w-4 animate-pulse rounded-full bg-current opacity-60" aria-hidden="true" /> : null}
      {!isLoading ? leftIcon : null}
      {children}
      {rightIcon}
    </button>
  ),
);

Button.displayName = 'Button';
