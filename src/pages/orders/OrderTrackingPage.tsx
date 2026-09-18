import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Building2,
  Phone,
  MessageSquare,
  Download,
  ShieldCheck,
  CheckCircle2,
  Package,
  Truck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useOrderStore } from '../../stores/useOrderStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useRequirementStore } from '../../stores/useRequirementStore';
import { OrderTimeline } from '../../components/ui/OrderTimeline';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import { OrderStatus } from '../../types';
import { FadeIn, SlideUp } from '../../components/motion/MotionPrimitives';

const STATUS_SEQUENCE: OrderStatus[] = [
  'requirement_accepted',
  'confirmed',
  'processing',
  'packed',
  'shipped',
  'delivered',
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  requirement_accepted: 'Requirement Accepted',
  confirmed: 'Order Confirmed',
  processing: 'Processing',
  packed: 'Packed',
  shipped: 'Shipped',
  delivered: 'Delivered',
};

const STATUS_BADGE_VARIANT: Record<
  OrderStatus,
  'info' | 'warning' | 'success' | 'neutral'
> = {
  requirement_accepted: 'info',
  confirmed: 'info',
  processing: 'warning',
  packed: 'warning',
  shipped: 'info',
  delivered: 'success',
};

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById, updateOrderStatus } = useOrderStore();
  const { user } = useAuthStore();
  const { getRequirementById } = useRequirementStore();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const order = id ? getOrderById(id) : undefined;
  const requirement = order?.requirementId
    ? getRequirementById(order.requirementId)
    : undefined;

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="glass-card max-w-md w-full p-8 rounded-3xl border border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto border border-slate-800">
            <AlertCircle className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Order Not Found</h2>
          <p className="text-slate-400 text-sm">
            We couldn't find order #{id}. Please check the order ID and try again.
          </p>
          <Button onClick={() => navigate(-1)} leftIcon={<ArrowLeft className="w-4 h-4" />} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const currentIndex = STATUS_SEQUENCE.indexOf(order.status);
  const nextStatus =
    currentIndex < STATUS_SEQUENCE.length - 1
      ? STATUS_SEQUENCE[currentIndex + 1]
      : null;

  const isVendorOrAdmin =
    user?.role === 'vendor' ||
    user?.role === 'admin' ||
    user?.id === order.vendorId;

  const handleAdvanceStatus = (targetStatus: OrderStatus) => {
    setUpdating(true);
    setTimeout(() => {
      updateOrderStatus(order.id, targetStatus);
      setUpdating(false);
      setToastMessage(
        `Order status updated to "${STATUS_LABELS[targetStatus]}" successfully!`
      );
    }, 400);
  };

  const handleDownloadInvoice = () => {
    setToastMessage(`Downloading invoice for Order #${order.id}...`);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* LAYER 0: Background Grid & Gradient */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-radial-gradient pointer-events-none z-0" />

      {/* LAYER 1: Oversized Decorative Typography Anchor */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-7xl flex justify-center pointer-events-none z-[1] select-none overflow-hidden">
        <span className="editorial-bg-text font-serif-editorial italic text-slate-100/10 text-[60px] sm:text-[110px] md:text-[160px] lg:text-[200px] uppercase tracking-tighter leading-none whitespace-nowrap">
          IN MOTION
        </span>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          id="order-toast"
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* CONTENT LAYER */}
      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Top Navigation */}
        <SlideUp className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-xs font-mono-tech font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </button>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={handleDownloadInvoice}
              className="border-slate-800 text-slate-300 hover:bg-slate-900 font-mono-tech"
            >
              Download Invoice
            </Button>
            {requirement && (
              <Link to={`/customer/requirements/${requirement.id}`}>
                <Button variant="ghost" size="sm" className="text-indigo-400 hover:text-indigo-300 font-mono-tech">
                  View Original Requirement
                </Button>
              </Link>
            )}
          </div>
        </SlideUp>

        {/* Main Order Header Card */}
        <FadeIn delay={0.1} className="glass-card p-6 md:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-3 mb-2 font-mono-tech">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-2.5 py-1 rounded-md border border-indigo-800/50">
                  Order ID
                </span>
                <h1 className="text-2xl font-extrabold text-white">{order.id}</h1>
                <Badge variant={STATUS_BADGE_VARIANT[order.status]}>
                  {STATUS_LABELS[order.status]}
                </Badge>
              </div>
              <h2 className="text-xl font-bold text-slate-200">{order.title}</h2>
              <p className="text-xs text-slate-400 font-mono-tech mt-1">
                Fulfilling Vendor: <span className="font-medium text-slate-200">{order.vendorName}</span> • Placed on {order.createdAt}
              </p>
            </div>

            <div className="text-left md:text-right glass-card p-4 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 font-mono-tech block">
                Total Order Amount
              </span>
              <span className="text-2xl font-black text-white font-mono-tech">
                ₹{order.totalAmount.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-emerald-400 font-mono-tech font-bold block mt-0.5">
                ✓ Payment Secured via Escrow
              </span>
            </div>
          </div>

          {/* 6-Stage Timeline Component */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-400" />
                Order Progress & Fulfill Stepper
              </h3>
              <span className="text-xs font-mono-tech font-bold text-slate-300 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                Estimated Delivery: {order.expectedDelivery}
              </span>
            </div>

            <OrderTimeline timeline={order.timeline} currentStatus={order.status} />
          </div>

          {/* Status Control Panel */}
          <div className="mt-8 pt-6 border-t border-slate-800 bg-slate-900/60 -mx-6 -mb-6 md:-mx-8 md:-mb-8 p-6 md:p-8 rounded-b-3xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-bold text-white font-mono-tech">
                    {isVendorOrAdmin ? 'Vendor Management Console' : 'Interactive Order Simulator'}
                  </h4>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isVendorOrAdmin
                    ? 'Advance the order status as fulfillment progresses.'
                    : 'Demonstrate live order stage progression.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 font-mono-tech">
                {nextStatus ? (
                  <Button
                    variant="primary"
                    size="sm"
                    isLoading={updating}
                    leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    onClick={() => handleAdvanceStatus(nextStatus)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                  >
                    Advance to "{STATUS_LABELS[nextStatus]}"
                  </Button>
                ) : (
                  <Badge variant="success" size="md">
                    ✓ Order Fully Delivered
                  </Badge>
                )}

                <select
                  className="text-xs border border-slate-800 rounded-xl px-3 py-2 bg-slate-900 text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  value={order.status}
                  onChange={(e) => handleAdvanceStatus(e.target.value as OrderStatus)}
                >
                  {STATUS_SEQUENCE.map((st) => (
                    <option key={st} value={st} className="bg-slate-900 text-white">
                      Jump to: {STATUS_LABELS[st]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Details Grid: Delivery, Address, Breakdown, Vendor */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-400" />
                Delivery & Shipping Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="space-y-1 font-mono-tech">
                  <span className="text-xs text-slate-400 uppercase tracking-wider block">
                    Expected Delivery Date
                  </span>
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    <span>{order.expectedDelivery}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    On-schedule delivery via Priority Express Courier
                  </p>
                </div>

                <div className="space-y-1 font-mono-tech">
                  <span className="text-xs text-slate-400 uppercase tracking-wider block">
                    Delivery Destination
                  </span>
                  <div className="flex items-start gap-2 text-white font-bold text-sm">
                    <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>
                      123 Technology Park, OMR Road, Chennai - 600096, Tamil Nadu, India
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Breakdown Card */}
            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white">
                Financial Breakdown
              </h3>

              <div className="space-y-3 text-xs font-mono-tech">
                <div className="flex justify-between text-slate-400">
                  <span>Agreed Offer Price</span>
                  <span className="font-bold text-white">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Customization & Quality Check</span>
                  <span className="text-emerald-400 font-bold">Included Free</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Doorstep Delivery & Insurance</span>
                  <span className="text-emerald-400 font-bold">Included Free</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Applicable Taxes (GST 18%)</span>
                  <span className="font-bold text-slate-300">Included</span>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-sm font-bold text-white">
                  <span>Total Amount Paid</span>
                  <span className="text-indigo-400 text-base">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right 1 Col: Vendor Information */}
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                Vendor Information
              </h3>

              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="w-12 h-12 bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 font-bold text-lg rounded-2xl flex items-center justify-center shrink-0 font-serif-editorial italic">
                  {order.vendorName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-white">{order.vendorName}</h4>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono-tech text-slate-400 mt-0.5">
                    <span className="text-amber-400 font-bold">★ 4.8</span>
                    <span>• 98% Fulfillment Rate</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs font-mono-tech text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Vendor ID</span>
                  <span className="text-indigo-400 font-bold">{order.vendorId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Support Contact</span>
                  <span className="text-slate-200">+91 98765 43210</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Location</span>
                  <span className="text-slate-200">Chennai, TN</span>
                </div>
              </div>

              <div className="pt-2 space-y-2 font-mono-tech">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-slate-800 text-slate-300 hover:bg-slate-900"
                  leftIcon={<MessageSquare className="w-4 h-4" />}
                  onClick={() => setToastMessage(`Chat opened with ${order.vendorName}`)}
                >
                  Contact Vendor Support
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-slate-400 hover:text-white"
                  leftIcon={<Phone className="w-4 h-4" />}
                  onClick={() => setToastMessage(`Calling ${order.vendorName}...`)}
                >
                  Request Callback
                </Button>
              </div>
            </div>

            {/* Buyer Protection Guarantee */}
            <div className="glass-card p-5 rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/80 to-slate-900 text-xs font-mono-tech space-y-2">
              <div className="flex items-center gap-2 font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Reversely Buyer Guarantee
              </div>
              <p className="text-slate-300 leading-relaxed">
                Your payment remains safely in escrow until you confirm delivery and inspect quality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
