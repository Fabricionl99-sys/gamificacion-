import { X } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from './Button';
import { cn } from '../../utils/classnames';

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  title?: string;
  description?: string;
  onClose: () => void;
  className?: string;
  labelledBy?: string;
}

export function Modal({
  children,
  isOpen,
  title,
  description,
  onClose,
  className,
  labelledBy = 'modal-title',
}: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex animate-[fade-in_180ms_ease-out] items-end justify-center bg-[rgba(10,14,19,0.85)] p-4 backdrop-blur-xs md:items-center"
      role="dialog"
      aria-labelledby={title ? labelledBy : undefined}
    >
      <div
        className={cn(
          'card-glass max-h-[90vh] w-full max-w-[420px] animate-[modal-enter_200ms_ease-out] overflow-y-auto rounded-xl p-5 shadow-modal',
          className,
        )}
      >
        {(title || description) && (
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              {title ? (
                <h2 id={labelledBy} className="text-lg font-semibold text-text-primary">
                  {title}
                </h2>
              ) : null}
              {description ? <p className="mt-1 text-sm text-text-secondary">{description}</p> : null}
            </div>
            <Button aria-label="cerrar modal" onClick={onClose} size="icon" variant="ghost">
              <X size={18} />
            </Button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
