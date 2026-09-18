import React from 'react';
import { EditorialBackgroundText } from './EditorialBackgroundText';

export interface PageHeroProps {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  description?: string;
  bgText?: string;
  action?: React.ReactNode;
  stats?: React.ReactNode;
  className?: string;
}

export const PageHero: React.FC<PageHeroProps> = ({
  eyebrow,
  title,
  titleHighlight,
  description,
  bgText,
  action,
  stats,
  className = '',
}) => {
  return (
    <div className={`relative mb-8 sm:mb-10 pb-6 border-b border-white/8 overflow-hidden ${className}`}>
      {bgText && <EditorialBackgroundText text={bgText} />}

      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-3xl">
          {eyebrow && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5B37F5]/15 border border-[#5B37F5]/30 text-[#6B8CFF] text-xs font-semibold uppercase tracking-widest font-mono-tech mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2BD696] animate-pulse" />
              {eyebrow}
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F5F7FF] tracking-tight font-sans">
            {title}{' '}
            {titleHighlight && (
              <span className="font-serif-editorial italic font-normal text-gradient-indigo">
                {titleHighlight}
              </span>
            )}
          </h1>
          {description && (
            <p className="mt-3 text-base sm:text-lg text-[#9DA9C6] leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
        </div>

        {(action || stats) && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {stats}
            {action}
          </div>
        )}
      </div>
    </div>
  );
};
