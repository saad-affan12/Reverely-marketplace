import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { EditorialBackgroundText } from '../layout/EditorialBackgroundText';

interface AdminLayoutProps {
  title: string;
  eyebrow?: string;
  description?: string;
  watermark: string;
  metrics?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  title,
  eyebrow = 'MARKETPLACE CONTROL CENTER',
  description,
  watermark,
  metrics,
  actions,
  children,
}) => {
  return (
    <div className="relative min-h-screen bg-[#050816] text-[#F5F7FF] font-sans py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Background Grid & Top Gradient */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px] h-[500px] bg-radial-gradient pointer-events-none z-0" />

      {/* Editorial Background Text */}
      <EditorialBackgroundText text={watermark} />

      {/* Content Container */}
      <div className="relative z-10 max-w-[1440px] mx-auto space-y-8">
        {/* Editorial Hero Banner */}
        <div className="bg-[#0F1428]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 text-white shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5B37F5]/15 text-[#6B8CFF] text-xs font-mono-tech uppercase tracking-widest border border-[#5B37F5]/30">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2BD696]" /> {eyebrow}
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-sans">
                {title.split(' ')[0]}{' '}
                <span className="font-serif-editorial italic text-gradient-indigo font-normal">
                  {title.split(' ').slice(1).join(' ')}
                </span>
              </h1>
              {description && (
                <p className="text-[#9DA9C6] text-sm max-w-2xl leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {actions && (
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                {actions}
              </div>
            )}
          </div>

          {/* Quick Metrics Slot */}
          {metrics && (
            <div className="pt-2 border-t border-white/8">
              {metrics}
            </div>
          )}
        </div>

        {/* Main Content Body */}
        <div>{children}</div>
      </div>
    </div>
  );
};
