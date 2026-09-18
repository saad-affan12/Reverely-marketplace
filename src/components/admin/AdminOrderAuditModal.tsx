import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  User,
  Store,
  DollarSign,
  ShieldCheck,
  Calendar,
  Building,
} from 'lucide-react';
import { Order } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface AdminOrderAuditModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminOrderAuditModal: React.FC<AdminOrderAuditModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!order) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
      case 'packed':
        return 'info';
      case 'processing':
      case 'confirmed':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  const subtotal = Math.round(order.totalAmount * 0.82);
  const gst = Math.round(order.totalAmount * 0.13);
  const platformFee = order.totalAmount - subtotal - gst;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-3xl glass-card border border-slate-700/80 bg-slate-950 rounded-3xl shadow-2xl overflow-hidden z-10 my-8 text-slate-100"
          >
            {/* Modal Header */}
            <div className="p-6 sm:p-8 border-b border-slate-800 flex items-start justify-between gap-4 bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 font-mono-tech text-xs text-indigo-400 uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4" /> Platform Order Audit Log
                </div>
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
                  {order.id}{' '}
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </h2>
                <p className="text-xs font-sans text-slate-400">{order.title}</p>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors border border-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-8 max-h-[75vh] overflow-y-auto">
              {/* Top Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <span className="text-[10px] font-mono-tech uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-400" /> Customer Information
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">{order.customerName}</p>
                    <p className="text-xs text-slate-400 font-mono-tech">ID: {order.customerId}</p>
                  </div>
                </div>

                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <span className="text-[10px] font-mono-tech uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-emerald-400" /> Vendor Supplier
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">{order.vendorName}</p>
                    <p className="text-xs text-slate-400 font-mono-tech">ID: {order.vendorId}</p>
                  </div>
                </div>
              </div>

              {/* Sequential Order Fulfillment Timeline */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono-tech uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400" /> Fulfillment Timeline Status
                </h3>

                <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 space-y-6">
                  {order.timeline.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-4">
                      {/* Vertical line connecting nodes */}
                      {idx < order.timeline.length - 1 && (
                        <div
                          className={`absolute left-4 top-8 bottom-0 w-0.5 -ml-px ${
                            step.completed ? 'bg-indigo-500' : 'bg-slate-800'
                          }`}
                        />
                      )}

                      {/* Timeline icon indicator */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 z-10 transition-colors ${
                          step.completed
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400/30'
                            : 'bg-slate-950 text-slate-600 border border-slate-800'
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="font-mono-tech text-[10px]">{idx + 1}</span>
                        )}
                      </div>

                      <div className="flex-1 space-y-0.5 pt-1">
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-xs font-bold font-sans ${
                              step.completed ? 'text-white' : 'text-slate-500'
                            }`}
                          >
                            {step.label}
                          </p>
                          <span className="text-[10px] font-mono-tech text-slate-500">
                            {step.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono-tech text-slate-400">
                          Status Code: <span className="uppercase text-slate-300">{step.status}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Audit Breakdown */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono-tech uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" /> Financial Settlement Breakdown
                </h3>

                <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 text-xs font-mono-tech space-y-2.5">
                  <div className="flex justify-between text-slate-400">
                    <span>Base Goods & Services Subtotal:</span>
                    <span className="text-slate-200">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Platform Service Commission (5%):</span>
                    <span className="text-indigo-400">{formatCurrency(platformFee)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Applicable Taxes & GST (18%):</span>
                    <span className="text-slate-200">{formatCurrency(gst)}</span>
                  </div>
                  <div className="pt-3 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
                    <span>Total Settlement GMV:</span>
                    <span className="text-emerald-400">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-800 bg-slate-950 flex justify-between items-center text-xs font-mono-tech">
              <div className="text-slate-500 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Created: {order.createdAt}
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={onClose}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
              >
                Close Audit View
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
