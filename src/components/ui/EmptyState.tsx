import React from 'react';
import { Button } from './Button';
import { PackageOpen } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <PackageOpen className="w-10 h-10 text-[#6B8CFF]" />,
  title,
  description,
  actionText,
  onAction,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-10 sm:p-14 bg-[#0F1428]/80 backdrop-blur-xl border border-white/10 border-dashed rounded-3xl text-center my-4 ${className}`}>
      <div className="p-4 bg-[#5B37F5]/10 border border-[#5B37F5]/20 rounded-2xl mb-4 shadow-lg shadow-[#5B37F5]/10">
        {icon}
      </div>
      <h4 className="text-xl font-bold text-[#F5F7FF] mb-2 tracking-tight">{title}</h4>
      <p className="text-sm text-[#9DA9C6] max-w-md mb-6 leading-relaxed">{description}</p>
      {action ? (
        action
      ) : (
        actionText && onAction && (
          <Button onClick={onAction} variant="primary" size="md">
            {actionText}
          </Button>
        )
      )}
    </div>
  );
};
