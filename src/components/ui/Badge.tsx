import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'info' | 'accent';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center font-semibold rounded-full border tracking-wide uppercase font-mono-tech whitespace-nowrap transition-colors';

  const variants = {
    primary: 'bg-[#5B37F5]/15 text-[#6B8CFF] border-[#5B37F5]/30',
    success: 'bg-[#2BD696]/15 text-[#2BD696] border-[#2BD696]/30',
    warning: 'bg-[#FAB505]/15 text-[#FAB505] border-[#FAB505]/30',
    danger: 'bg-[#FF5677]/15 text-[#FF5677] border-[#FF5677]/30',
    neutral: 'bg-white/5 text-[#9DA9C6] border-white/10',
    info: 'bg-[#48CBFF]/15 text-[#48CBFF] border-[#48CBFF]/30',
    accent: 'bg-[#6B8CFF]/15 text-[#6B8CFF] border-[#6B8CFF]/30',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-xs',
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
