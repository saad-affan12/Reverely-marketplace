import React from 'react';
import { Loader2 } from 'lucide-react';
import { Skeleton } from './Skeleton';

export interface LoadingStateProps {
  message?: string;
  type?: 'spinner' | 'skeleton';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading marketplace data...',
  type = 'spinner',
}) => {
  if (type === 'skeleton') {
    return (
      <div className="w-full space-y-4 p-4">
        <Skeleton className="h-8 w-1/3 rounded-xl" />
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-28 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="p-3 bg-[#5B37F5]/10 border border-[#5B37F5]/20 rounded-2xl mb-3 shadow-lg shadow-[#5B37F5]/20">
        <Loader2 className="w-7 h-7 text-[#6B8CFF] animate-spin" />
      </div>
      <p className="text-sm font-medium text-[#9DA9C6] font-mono-tech">{message}</p>
    </div>
  );
};
