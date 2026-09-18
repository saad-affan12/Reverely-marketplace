import React from 'react';
import { EditorialBackgroundText } from './EditorialBackgroundText';

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  bgText?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
  bgText,
}) => {
  return (
    <div className={`relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 ${className}`}>
      {bgText && <EditorialBackgroundText text={bgText} />}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

