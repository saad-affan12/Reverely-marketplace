import React from 'react';
import { Card } from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  subtitle,
  className = '',
}) => {
  return (
    <Card variant="stat" hoverEffect className={`flex flex-col justify-between group ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-[#9DA9C6] uppercase tracking-wider font-mono-tech">
          {title}
        </span>
        {icon && (
          <div className="p-2.5 bg-[#5B37F5]/10 text-[#6B8CFF] border border-[#5B37F5]/20 rounded-xl group-hover:bg-[#5B37F5]/20 group-hover:text-white transition-colors">
            {icon}
          </div>
        )}
      </div>

      <div>
        <div className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FF] tracking-tight font-sans">
          {value}
        </div>

        <div className="flex items-center gap-2 mt-2">
          {change && (
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border font-mono-tech ${
                isPositive
                  ? 'bg-[#2BD696]/15 text-[#2BD696] border-[#2BD696]/30'
                  : 'bg-[#FF5677]/15 text-[#FF5677] border-[#FF5677]/30'
              }`}
            >
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {change}
            </span>
          )}
          {subtitle && (
            <span className="text-xs text-[#6F7D9C]">{subtitle}</span>
          )}
        </div>
      </div>
    </Card>
  );
};
