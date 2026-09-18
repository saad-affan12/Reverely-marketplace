import React from 'react';

export interface EditorialBackgroundTextProps {
  text: string;
  className?: string;
}

export const EditorialBackgroundText: React.FC<EditorialBackgroundTextProps> = ({
  text,
  className = '',
}) => {
  return (
    <div
      className={`absolute left-1/2 -translate-x-1/2 top-4 pointer-events-none select-none z-0 overflow-hidden w-full flex justify-center ${className}`}
      aria-hidden="true"
    >
      <span className="font-serif-editorial italic text-7xl sm:text-9xl md:text-[140px] lg:text-[180px] font-extrabold tracking-tighter text-white/[0.05] whitespace-nowrap leading-none">
        {text}
      </span>
    </div>
  );
};
