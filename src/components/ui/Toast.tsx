import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { cn } from '../../utils/classnames';

export interface ToastProps {
  message: string;
  title?: string;
  tone?: 'success' | 'danger' | 'info';
  actionLabel?: string;
  onAction?: () => void;
}

const toneStyles = {
  success: 'border-accent/30',
  danger: 'border-danger/40',
  info: 'border-info/40',
};

const toneIcons = {
  success: CheckCircle2,
  danger: AlertCircle,
  info: Info,
};

export function Toast({ message, title, tone = 'info', actionLabel, onAction }: ToastProps) {
  const Icon = toneIcons[tone];

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed bottom-4 left-4 right-4 z-50 mx-auto flex max-w-sm animate-[fade-in_200ms_ease-out] items-center gap-3 rounded-lg border bg-bg-elevated/95 p-4 text-sm text-text-primary shadow-modal backdrop-blur-xl',
        toneStyles[tone],
      )}
    >
      <Icon className={cn('h-5 w-5 flex-none', tone === 'success' && 'text-accent', tone === 'danger' && 'text-danger', tone === 'info' && 'text-info')} />
      <span className="flex-1">
        {title ? <span className="block text-lg font-black text-accent">{title}</span> : null}
        <span>{message}</span>
      </span>
      {actionLabel ? (
        <button className="text-sm font-medium text-accent hover:text-accent-hover" type="button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export function ToastViewport() {
  const { toasts, dismiss } = useToast();

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          title={toast.title}
          tone={toast.tone}
          actionLabel={toast.actionLabel}
          onAction={() => {
            toast.onAction?.();
            dismiss(toast.id);
          }}
        />
      ))}
    </>
  );
}
