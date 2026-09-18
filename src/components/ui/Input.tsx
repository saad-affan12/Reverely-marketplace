import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-[#9DA9C6] font-mono-tech">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-[#6F7D9C] pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full bg-[#131A32] border ${
              error
                ? 'border-[#FF5677] focus:ring-[#FF5677]/30'
                : 'border-white/10 focus:border-[#5B37F5] focus:ring-[#5B37F5]/25'
            } rounded-xl text-sm text-[#F5F7FF] placeholder:text-[#6F7D9C] transition-all duration-200 focus:outline-none focus:ring-2 ${
              leftIcon ? 'pl-10' : 'pl-4'
            } ${rightIcon ? 'pr-10' : 'pr-4'} py-2.5 ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-[#6F7D9C] flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-[#FF5677] font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#6F7D9C]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
