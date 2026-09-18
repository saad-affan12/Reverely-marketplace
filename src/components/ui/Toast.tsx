import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  id: string;
  type?: 'success' | 'error' | 'info';
  message: string;
  onClose: (id: string) => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type = 'success',
  message,
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#2BD696]" />,
    error: <AlertCircle className="w-5 h-5 text-[#FF5677]" />,
    info: <Info className="w-5 h-5 text-[#6B8CFF]" />,
  };

  const styles = {
    success: 'border-[#2BD696]/30 bg-[#0F1428]/95 shadow-[#2BD696]/10',
    error: 'border-[#FF5677]/30 bg-[#0F1428]/95 shadow-[#FF5677]/10',
    info: 'border-[#5B37F5]/30 bg-[#0F1428]/95 shadow-[#5B37F5]/10',
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 border backdrop-blur-xl shadow-2xl rounded-2xl text-[#F5F7FF] text-sm animate-slideIn transition-all min-w-[280px] max-w-md ${styles[type]}`}
    >
      {icons[type]}
      <span className="flex-1 font-medium leading-snug">{message}</span>
      <button
        onClick={() => onClose(id)}
        className="p-1 text-[#6F7D9C] hover:text-[#F5F7FF] rounded-lg transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
