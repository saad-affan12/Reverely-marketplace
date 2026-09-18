import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-xs font-semibold uppercase tracking-wider text-[#9DA9C6] font-mono-tech">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`w-full bg-[#131A32] border ${
            error
              ? 'border-[#FF5677] focus:ring-[#FF5677]/30'
              : 'border-white/10 focus:border-[#5B37F5] focus:ring-[#5B37F5]/25'
          } rounded-xl text-sm text-[#F5F7FF] placeholder:text-[#6F7D9C] transition-all duration-200 focus:outline-none focus:ring-2 p-3.5 ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-xs text-[#FF5677] font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#6F7D9C]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
