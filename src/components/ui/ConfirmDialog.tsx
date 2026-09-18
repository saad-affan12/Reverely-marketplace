import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="flex flex-col items-center text-center p-2">
        <div
          className={`p-3.5 rounded-2xl mb-4 border ${
            variant === 'danger'
              ? 'bg-[#FF5677]/15 text-[#FF5677] border-[#FF5677]/30'
              : 'bg-[#5B37F5]/15 text-[#6B8CFF] border-[#5B37F5]/30'
          }`}
        >
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h4 className="text-lg font-bold text-[#F5F7FF] mb-2 tracking-tight">{title}</h4>
        <p className="text-sm text-[#9DA9C6] mb-6 leading-relaxed">{message}</p>
        <div className="flex items-center gap-3 w-full">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            className="flex-1"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
