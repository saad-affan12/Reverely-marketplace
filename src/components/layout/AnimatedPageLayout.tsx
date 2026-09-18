import React from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';

interface AnimatedPageLayoutProps {
  children: React.ReactNode;
}

export const AnimatedPageLayout: React.FC<AnimatedPageLayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex-1"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
