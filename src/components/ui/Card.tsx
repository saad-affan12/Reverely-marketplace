import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive' | 'stat' | 'feature' | 'danger' | 'success';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hoverEffect = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-2xl border transition-all duration-300';

  const variants = {
    default: 'bg-[#0F1428]/90 border-white/8 text-[#F5F7FF] shadow-xl',
    elevated: 'bg-[#131A32] border-white/12 text-[#F5F7FF] shadow-2xl shadow-black/50',
    interactive:
      'bg-[#0F1428]/90 border-white/8 text-[#F5F7FF] shadow-xl hover:-translate-y-1 hover:border-[#5B37F5]/40 hover:bg-[#18203A] cursor-pointer hover:shadow-2xl hover:shadow-[#5B37F5]/10',
    stat: 'bg-[#0F1428]/80 backdrop-blur-xl border-white/8 text-[#F5F7FF] relative overflow-hidden',
    feature:
      'bg-gradient-to-br from-[#0F1428] via-[#131A32] to-[#0F1428] border-[#5B37F5]/30 text-[#F5F7FF] shadow-2xl shadow-[#5B37F5]/10',
    danger: 'bg-[#FF5677]/10 border-[#FF5677]/30 text-[#F5F7FF]',
    success: 'bg-[#2BD696]/10 border-[#2BD696]/30 text-[#F5F7FF]',
  };

  const hoverClass = hoverEffect && variant !== 'interactive'
    ? 'hover:-translate-y-1 hover:border-[#5B37F5]/40 hover:shadow-2xl hover:shadow-black/60 cursor-pointer'
    : '';

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${hoverClass} p-5 sm:p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`mb-4 flex flex-col gap-1 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <h3 className={`text-lg font-bold text-[#F5F7FF] tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <p className={`text-xs text-[#9DA9C6] ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`mt-5 pt-4 border-t border-white/8 flex items-center justify-between text-xs text-[#9DA9C6] ${className}`} {...props}>
    {children}
  </div>
);
