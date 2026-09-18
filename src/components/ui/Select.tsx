import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold uppercase tracking-wider text-[#9DA9C6] font-mono-tech">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            className={`w-full appearance-none bg-[#131A32] border ${
              error
                ? 'border-[#FF5677] focus:ring-[#FF5677]/30'
                : 'border-white/10 focus:border-[#5B37F5] focus:ring-[#5B37F5]/25'
            } rounded-xl text-sm text-[#F5F7FF] transition-all duration-200 focus:outline-none focus:ring-2 px-4 py-2.5 pr-10 ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="bg-[#0F1428] text-[#6F7D9C]">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#0F1428] text-[#F5F7FF]">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-[#6F7D9C] absolute right-3.5 pointer-events-none" />
        </div>
        {error && <p className="text-xs text-[#FF5677] font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
