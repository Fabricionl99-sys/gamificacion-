import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

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
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    const focusable = getFocusableElements(dialog);
    const firstElement = focusable[0];
    firstElement?.focus();
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = getFocusableElements(dialogRef.current);
    if (focusable.length === 0) return;

    const firstElement = focusable[0];
    const lastElement = focusable[focusable.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex animate-fade-in items-end justify-center bg-bg-overlay p-4 backdrop-blur-xs md:items-center"
      role="dialog"
      aria-labelledby={title ? labelledBy : undefined}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={dialogRef}
        className={cn(
          'card-glass max-h-[90vh] w-full max-w-[420px] animate-modal-enter overflow-y-auto rounded-xl p-5 shadow-modal',
          className,
        )}
        tabIndex={-1}
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

function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
    ),
  );
}
