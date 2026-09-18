import React from 'react';
import {
  FileCheck,
  CheckCircle2,
  PackageCheck,
  Package,
  Truck,
  Home,
  Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OrderStatus, OrderTimelineItem } from '../../types';

interface OrderTimelineProps {
  timeline: OrderTimelineItem[];
  currentStatus: OrderStatus;
}

const STAGE_CONFIG: Record<
  OrderStatus,
  { defaultLabel: string; icon: React.ElementType; description: string }
> = {
  requirement_accepted: {
    defaultLabel: 'Requirement Accepted',
    icon: FileCheck,
    description: 'Customer selected and accepted vendor offer',
  },
  confirmed: {
    defaultLabel: 'Order Confirmed',
    icon: CheckCircle2,
    description: 'Order created and payment terms locked',
  },
  processing: {
    defaultLabel: 'Processing',
    icon: Package,
    description: 'Vendor is preparing and customizing items',
  },
  packed: {
    defaultLabel: 'Packed',
    icon: PackageCheck,
    description: 'Quality checked and securely packaged',
  },
  shipped: {
    defaultLabel: 'Shipped',
    icon: Truck,
    description: 'Handed to courier for delivery',
  },
  delivered: {
    defaultLabel: 'Delivered',
    icon: Home,
    description: 'Successfully received by customer',
  },
};

const STAGE_ORDER: OrderStatus[] = [
  'requirement_accepted',
  'confirmed',
  'processing',
  'packed',
  'shipped',
  'delivered',
];

export const OrderTimeline: React.FC<OrderTimelineProps> = ({
  timeline,
  currentStatus,
}) => {
  const currentIndex = STAGE_ORDER.indexOf(currentStatus);
  const progressPercent = (Math.max(0, currentIndex) / (STAGE_ORDER.length - 1)) * 90;

  // Map timeline items or fallback to STAGE_ORDER defaults
  const stages = STAGE_ORDER.map((statusKey, index) => {
    const matchedItem = timeline?.find((item) => item.status === statusKey);
    const config = STAGE_CONFIG[statusKey];
    const isCompleted = index <= currentIndex;
    const isCurrent = index === currentIndex;

    return {
      status: statusKey,
      label: matchedItem?.label || config.defaultLabel,
      description: config.description,
      timestamp: matchedItem?.timestamp || (isCompleted ? 'Completed' : 'Pending'),
      Icon: config.icon,
      isCompleted,
      isCurrent,
      index,
    };
  });

  return (
    <div className="w-full">
      {/* Desktop Stepper */}
      <div className="hidden md:block py-6">
        <div className="flex items-center justify-between relative">
          {/* Progress bar background line */}
          <div className="absolute top-1/2 left-6 right-6 h-1 bg-slate-200 -translate-y-6 z-0 rounded-full" />
          {/* Active progress bar line with Framer Motion spring */}
          <motion.div
            className="absolute top-1/2 left-6 h-1 bg-gradient-to-r from-indigo-600 to-emerald-500 -translate-y-6 z-0 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />

          {stages.map((stage) => {
            const { Icon, isCompleted, isCurrent, label, timestamp, index } = stage;

            return (
              <div
                key={stage.status}
                className="relative z-10 flex flex-col items-center flex-1 text-center"
              >
                {/* Step Badge with Animated Scale & Pulsing Current Ring */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.15 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 relative ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-400 border border-slate-300'
                  }`}
                >
                  {isCurrent && (
                    <span className="absolute inset-0 rounded-full bg-indigo-500/40 animate-ping" />
                  )}
                  <Icon className="w-5 h-5 relative z-10" />
                </motion.div>

                {/* Stage Info */}
                <div className="mt-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Step {index + 1}
                  </span>
                  <h4
                    className={`text-sm font-bold leading-tight transition-colors ${
                      isCurrent
                        ? 'text-indigo-600'
                        : isCompleted
                        ? 'text-slate-900'
                        : 'text-slate-400'
                    }`}
                  >
                    {label}
                  </h4>
                  <div className="flex items-center justify-center gap-1 mt-1 text-xs text-slate-500">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{timestamp}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Stepper */}
      <div className="md:hidden py-4">
        <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
          {stages.map((stage) => {
            const { Icon, isCompleted, isCurrent, label, description, timestamp, index } =
              stage;

            return (
              <motion.div
                key={stage.status}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative flex items-start group"
              >
                {/* Timeline node */}
                <div
                  className={`absolute -left-[31px] top-0.5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-md'
                      : isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-400 border border-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="ml-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">
                      Step {index + 1}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        isCurrent
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : isCompleted
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isCurrent ? 'In Progress' : isCompleted ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                  <h4
                    className={`text-base font-semibold mt-0.5 ${
                      isCurrent
                        ? 'text-indigo-600'
                        : isCompleted
                        ? 'text-slate-900'
                        : 'text-slate-500'
                    }`}
                  >
                    {label}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{description}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{timestamp}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
