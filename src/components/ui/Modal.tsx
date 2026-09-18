import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { motion, AnimatePresence } from 'motion/react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`relative z-10 w-full ${maxWidthClasses[maxWidth]} bg-[#0F1428] rounded-2xl shadow-2xl shadow-black/80 border border-white/12 overflow-hidden flex flex-col max-h-[90vh]`}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="px-6 py-4.5 border-b border-white/8 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#F5F7FF] tracking-tight">{title}</h3>
                  {description && (
                    <p className="text-xs text-[#9DA9C6] mt-0.5">{description}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-1 rounded-xl text-[#9DA9C6] hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            )}
            <div className="p-6 overflow-y-auto flex-1 text-[#F5F7FF]">{children}</div>
            {footer && (
              <div className="px-6 py-4 bg-[#0B1020] border-t border-white/8 flex items-center justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
