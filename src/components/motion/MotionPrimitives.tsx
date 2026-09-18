import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, useSpring, useTransform, HTMLMotionProps } from 'motion/react';

// Motion Tokens
export const TRANSITION_FAST = { duration: 0.2, ease: [0.16, 1, 0.3, 1] };
export const TRANSITION_NORMAL = { duration: 0.35, ease: [0.16, 1, 0.3, 1] };
export const TRANSITION_SLOW = { duration: 0.5, ease: [0.16, 1, 0.3, 1] };
export const SPRING_BOUNCY = { type: 'spring', stiffness: 300, damping: 20 };
export const SPRING_SMOOTH = { type: 'spring', stiffness: 200, damping: 25 };

// 1. FadeIn
interface MotionProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const FadeIn: React.FC<MotionProps> = ({ children, delay = 0, duration = 0.35, className = '', ...props }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// 2. SlideUp
interface SlideUpProps extends MotionProps {
  distance?: number;
}

export const SlideUp: React.FC<SlideUpProps> = ({ children, delay = 0, duration = 0.4, distance = 20, className = '', ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: distance }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -distance }}
    transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// 3. ScaleIn
export const ScaleIn: React.FC<MotionProps> = ({ children, delay = 0, duration = 0.35, className = '', ...props }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// 4. StaggerContainer & StaggerItem
interface StaggerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  delay?: number;
  className?: string;
}

export const StaggerContainer: React.FC<StaggerProps> = ({ children, staggerDelay = 0.08, delay = 0, className = '' }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: {},
      visible: {
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: delay,
        },
      },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 16, scale: 0.98 },
      visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// 5. RevealOnScroll
interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export const RevealOnScroll: React.FC<RevealProps> = ({
  children,
  className = '',
  delay = 0,
  threshold = 0.2,
  direction = 'up',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });

  const getOffset = () => {
    switch (direction) {
      case 'up':
        return { y: 24, x: 0 };
      case 'down':
        return { y: -24, x: 0 };
      case 'left':
        return { x: 24, y: 0 };
      case 'right':
        return { x: -24, y: 0 };
      case 'none':
        return { x: 0, y: 0 };
    }
  };

  const offset = getOffset();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offset }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...offset }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// 6. HoverCard
interface HoverCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  lift?: number;
}

export const HoverCard: React.FC<HoverCardProps> = ({ children, className = '', lift = 4, ...props }) => (
  <motion.div
    whileHover={{ y: -lift, scale: 1.01, transition: { duration: 0.2, ease: 'easeOut' } }}
    whileTap={{ scale: 0.99 }}
    className={className}
    {...(props as HTMLMotionProps<'div'>)}
  >
    {children}
  </motion.div>
);

// 7. AnimatedCounter
interface CounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<CounterProps> = ({ value, prefix = '', suffix = '', duration = 1.5, className = '' }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayVal, setDisplayVal] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let startTime: number | null = null;
    let animationFrameId: number;

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayVal(Math.floor(easeOutProgress * value));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateCount);
      }
    };

    animationFrameId = requestAnimationFrame(animateCount);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayVal.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
};

// 8. Skeleton Loader
export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => (
  <div className={`animate-pulse bg-slate-200/80 rounded-md ${className}`} />
);
