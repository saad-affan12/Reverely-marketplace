import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#050816] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer select-none';

    const variants = {
      primary:
        'bg-[#5B37F5] hover:bg-[#704FFF] text-white focus:ring-[#5B37F5] shadow-lg shadow-[#5B37F5]/25 border border-[#5B37F5]/30',
      secondary:
        'bg-[#131A32] hover:bg-[#18203A] text-[#F5F7FF] border border-white/10 hover:border-white/20 focus:ring-[#6B8CFF]',
      outline:
        'border border-white/15 bg-transparent hover:bg-white/5 text-[#F5F7FF] hover:border-white/30 focus:ring-[#6B8CFF]',
      danger:
        'bg-[#FF5677] hover:bg-[#ff3b61] text-white focus:ring-[#FF5677] shadow-lg shadow-[#FF5677]/25 border border-[#FF5677]/30',
      success:
        'bg-[#2BD696] hover:bg-[#22c589] text-[#050816] font-semibold focus:ring-[#2BD696] shadow-lg shadow-[#2BD696]/25 border border-[#2BD696]/30',
      ghost:
        'hover:bg-white/10 text-[#9DA9C6] hover:text-[#F5F7FF] focus:ring-white/20',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5 h-8',
      md: 'px-4.5 py-2 text-sm gap-2 h-10',
      lg: 'px-6 py-2.5 text-base gap-2.5 h-12 font-semibold',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
