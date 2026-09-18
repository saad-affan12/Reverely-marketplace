import React from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading this section. Please try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-10 bg-[#FF5677]/10 border border-[#FF5677]/25 rounded-3xl text-center my-4 ${className}`}>
      <div className="p-3.5 bg-[#FF5677]/20 border border-[#FF5677]/40 rounded-2xl mb-4 text-[#FF5677]">
        <AlertOctagon className="w-8 h-8" />
      </div>
      <h4 className="text-xl font-bold text-[#F5F7FF] mb-2 tracking-tight">{title}</h4>
      <p className="text-sm text-[#9DA9C6] max-w-md mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <Button variant="danger" size="md" onClick={onRetry} leftIcon={<RotateCcw className="w-4 h-4" />}>
          Try Again
        </Button>
      )}
    </div>
  );
};
