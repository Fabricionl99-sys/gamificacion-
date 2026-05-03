import { AnimatePresence, motion } from 'framer-motion';
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
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(10,14,19,0.85)] p-4 backdrop-blur-xs md:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-labelledby={title ? labelledBy : undefined}
        >
          <motion.div
            className={cn(
              'card-glass max-h-[90vh] w-full max-w-[420px] overflow-y-auto rounded-xl p-5 shadow-modal',
              className,
            )}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
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
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
