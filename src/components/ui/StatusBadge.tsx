import React from 'react';
import { Badge } from './Badge';

export interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
}) => {
  const normalized = status.toUpperCase().trim();

  let variant: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'info' | 'accent' = 'neutral';

  switch (normalized) {
    case 'OPEN':
    case 'ACTIVE':
    case 'VERIFIED':
      variant = 'info';
      break;
    case 'CONFIRMED':
    case 'DELIVERED':
    case 'ACCEPTED':
    case 'COMPLETED':
      variant = 'success';
      break;
    case 'PENDING':
    case 'PROCESSING':
    case 'SHIPPED':
    case 'IN_PROGRESS':
      variant = 'warning';
      break;
    case 'CANCELLED':
    case 'REJECTED':
    case 'EXPIRED':
    case 'SUSPENDED':
      variant = 'danger';
      break;
    case 'FEATURED':
    case 'DRAFT':
      variant = 'accent';
      break;
    default:
      variant = 'neutral';
  }

  return (
    <Badge variant={variant} size={size} className={className}>
      <span className="w-1.5 h-1.5 rounded-full bg-current inline-block mr-1.5 animate-pulse" />
      {normalized.replace('_', ' ')}
    </Badge>
  );
};
