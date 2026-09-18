import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Send,
  ShieldCheck,
  Tag,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Award,
  AlertCircle,
  TrendingDown,
  LayoutDashboard,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useRequirementStore } from '../../stores/useRequirementStore';
import { useOfferStore } from '../../stores/useOfferStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { OfferBadge } from '../../types';
import {
  Card,
  Badge,
  Button,
  Input,
  Select,
  Textarea,
  EmptyState,
} from '../../components/ui';
import { PageContainer } from '../../components/layout';

export const SubmitOfferPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { getRequirementById } = useRequirementStore();
  const { submitOffer } = useOfferStore();
  const { user } = useAuthStore();

  const requirement = id ? getRequirementById(id) : undefined;

  const [price, setPrice] = useState<number>(
    requirement ? Math.round(requirement.maxBudget * 0.9) : 27500
  );
  const [deliveryDays, setDeliveryDays] = useState<number>(4);
  const [warranty, setWarranty] = useState<string>('30 Days');
  const [notes, setNotes] = useState<string>(
    'We specialize in bulk orders with high quality materials and custom branding. Full satisfaction guaranteed.'
  );
  const [includedServices, setIncludedServices] = useState<string[]>([
    'Custom Branding',
    'Doorstep Delivery',
    'Quality Proofing',
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedOfferId, setSubmittedOfferId] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const serviceOptions = [
    'Custom Branding',
    'Doorstep Delivery',
    'Quality Proofing',
    'Free Revisions',
    'Express Shipping',
    'On-site Installation',
  ];

  const handleServiceToggle = (service: string) => {
    setIncludedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const maxBudget = requirement?.maxBudget || 30000;
  const budgetDiff = maxBudget - price;
  const isBelowBudget = budgetDiff >= 0;

  const { matchScore, badges } = useMemo(() => {
    if (!requirement) return { matchScore: 90, badges: [] as OfferBadge[] };

    let score = 85;
    const diffRatio = (requirement.maxBudget - price) / requirement.maxBudget;
    score += Math.round(diffRatio * 20);

    if (deliveryDays <= 3) score += 3;
    if (includedServices.length >= 3) score += 2;

    const finalScore = Math.min(98, Math.max(70, score));

    const computedBadges: OfferBadge[] = [];
    if (price <= requirement.maxBudget * 0.92) {
      computedBadges.push('BEST VALUE');
    }
    if (deliveryDays <= 3) {
      computedBadges.push('FASTEST DELIVERY');
    }
    computedBadges.push('TOP RATED');

    return { matchScore: finalScore, badges: computedBadges };
  }, [requirement, price, deliveryDays, includedServices]);

  if (!requirement) {
    return (
      <PageContainer bgText="QUOTATION">
        <div className="py-12 flex items-center justify-center">
          <Card className="max-w-md w-full p-8 text-center border-slate-800">
            <EmptyState
              title="Requirement Not Found"
              description="The requirement you are trying to quote on does not exist."
              actionText="Back to Opportunities"
              onAction={() => navigate('/vendor/opportunities')}
            />
          </Card>
        </div>
      </PageContainer>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const vendorName = user?.companyName || user?.name || 'PrintHub Supplies';
      const vendorId = user?.id || 'ven-1';

      const newOffer = submitOffer({
        requirementId: requirement.id,
        vendorId,
        vendorName,
        vendorRating: 4.8,
        vendorTrustScore: 96,
        price,
        deliveryDays,
        warranty,
        includedServices,
        notes,
        matchScore,
        badges,
      });

      setSubmittedOfferId(newOffer.id);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  if (isSubmitted) {
    return (
      <PageContainer bgText="SUBMITTED">
        <div className="py-12 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl w-full"
          >
            <Card className="p-8 text-center space-y-6 shadow-2xl border-emerald-800/50 bg-slate-900">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
                className="w-16 h-16 bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 rounded-full flex items-center justify-center mx-auto"
              >
                <CheckCircle2 className="w-10 h-10" />
              </motion.div>

              <div className="space-y-2">
                <Badge variant="success" className="px-3 py-1 text-xs font-semibold">Offer Submitted Successfully</Badge>
                <h2 className="text-2xl font-extrabold text-white">
                  Quotation Submitted for {requirement.title}
                </h2>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed font-mono-tech">
                  Your quotation of <strong className="text-indigo-400">{formatCurrency(price)}</strong> has been broadcast to <strong className="text-white">{requirement.customerName}</strong>. You'll be notified when they review or accept your offer.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left space-y-2 text-xs font-mono-tech">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Quotation ID:</span>
                  <span className="font-bold text-white">{submittedOfferId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Your Quote Price:</span>
                  <span className="font-bold text-indigo-400 text-sm">{formatCurrency(price)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Delivery Commitment:</span>
                  <span className="font-medium text-slate-200">{deliveryDays} Days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Match Score Scorecard:</span>
                  <span className="font-bold text-emerald-400">{matchScore}% Match</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2 font-mono-tech">
                <Button
                  variant="outline"
                  className="w-full justify-center text-xs border-slate-800 text-slate-300 hover:bg-slate-900"
                  onClick={() => navigate('/vendor/dashboard')}
                  leftIcon={<LayoutDashboard className="w-4 h-4" />}
                >
                  Go to Vendor Dashboard
                </Button>

                <Button
                  variant="primary"
                  className="w-full justify-center text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                  onClick={() => navigate('/vendor/opportunities')}
                >
                  Browse More Opportunities
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer bgText="SUBMIT QUOTE">
      <div className="space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between font-mono-tech">
          <button
            onClick={() => navigate(`/vendor/opportunities/${requirement.id}`)}
            className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Opportunity Specs
          </button>

          <div className="inline-flex items-center gap-1.5 bg-indigo-950/80 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold border border-indigo-800/50">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quotation Builder</span>
          </div>
        </div>

        {/* Header Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Submit Quotation Offer
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-mono-tech mt-1">
            Provide your best price, delivery commitment, and warranty details for {requirement.title}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Requirement Summary Reference Card */}
          <div className="space-y-6">
            <Card variant="default" className="p-6 space-y-5 sticky top-6 border-slate-800 font-mono-tech">
              <div>
                <span className="text-xs font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-800/50 px-2 py-0.5 rounded uppercase tracking-wider">
                  {requirement.category}
                </span>
                <h3 className="text-base font-bold text-white mt-2 leading-snug">
                  {requirement.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Req ID: <span className="text-slate-200">{requirement.id}</span>
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-400">Customer Name:</span>
                  <span className="font-medium text-slate-200">{requirement.customerName}</span>
                </div>

                <div className="flex justify-between items-baseline">
                  <span className="text-slate-400">Quantity Needed:</span>
                  <span className="font-bold text-white">
                    {requirement.quantity} {requirement.unit}
                  </span>
                </div>

                <div className="flex justify-between items-baseline">
                  <span className="text-slate-400">Max Budget Ceiling:</span>
                  <span className="font-extrabold text-indigo-400 text-sm">
                    {formatCurrency(requirement.maxBudget)}
                  </span>
                </div>

                <div className="flex justify-between items-baseline">
                  <span className="text-slate-400">Delivery Location:</span>
                  <span className="font-medium text-slate-200">{requirement.location}</span>
                </div>

                <div className="flex justify-between items-baseline">
                  <span className="text-slate-400">Required Date:</span>
                  <span className="font-medium text-slate-200">{requirement.deadline}</span>
                </div>
              </div>

              {/* Requirement Description snippet */}
              <div className="pt-3 border-t border-slate-800 text-xs space-y-1">
                <span className="text-slate-400 font-medium block">Key Requirement Snippet:</span>
                <p className="text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 italic line-clamp-3">
                  "{requirement.description}"
                </p>
              </div>
            </Card>
          </div>

          {/* Right Column: Quotation Form + Feedback + Live Preview */}
          <div className="lg:col-span-2 space-y-6">
            <Card variant="default" className="p-6 sm:p-8 border-slate-800">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Visual Budget Differential Animated Banner */}
                <motion.div
                  layout
                  className={`p-4 rounded-xl border text-xs flex items-center justify-between font-mono-tech transition-colors ${
                    isBelowBudget
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50'
                      : 'bg-amber-950/60 text-amber-300 border-amber-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isBelowBudget ? (
                      <TrendingDown className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                    )}
                    <div>
                      <strong className="block text-sm font-bold">
                        {isBelowBudget
                          ? `${formatCurrency(budgetDiff)} Below Customer Budget`
                          : `${formatCurrency(Math.abs(budgetDiff))} Above Customer Budget`}
                      </strong>
                      <span className="opacity-90">
                        {isBelowBudget
                          ? 'Competitive Offer! Quotes under budget receive higher visibility & Best Value tags.'
                          : 'Higher price quotes require justified premium quality or warranty terms.'}
                      </span>
                    </div>
                  </div>

                  <motion.div
                    key={matchScore}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="shrink-0 font-bold bg-slate-900 px-3 py-1 rounded-lg text-xs border border-slate-800"
                  >
                    Match: {matchScore}%
                  </motion.div>
                </motion.div>

                {/* Form Core Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Input
                      label="Your Offered Price (₹ INR)"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      required
                      min={100}
                      helperText={`Customer max budget: ${formatCurrency(maxBudget)}`}
                    />
                  </div>

                  <div>
                    <Input
                      label="Delivery Time (Days)"
                      type="number"
                      value={deliveryDays}
                      onChange={(e) => setDeliveryDays(Number(e.target.value))}
                      required
                      min={1}
                      max={60}
                      helperText="Estimated days from order acceptance to delivery"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Select
                      label="Warranty Period"
                      value={warranty}
                      onChange={(e) => setWarranty(e.target.value)}
                      options={[
                        { value: 'None', label: 'No Warranty' },
                        { value: '30 Days', label: '30 Days Standard Warranty' },
                        { value: '60 Days', label: '60 Days Replacement Warranty' },
                        { value: '6 Months', label: '6 Months Full Warranty' },
                        { value: '1 Year', label: '1 Year Comprehensive Warranty' },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono-tech">
                      Your Vendor Trust Rating
                    </label>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between text-xs font-mono-tech">
                      <div className="flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-white">4.8 / 5.0 Rating</span>
                      </div>
                      <span className="text-emerald-400 font-semibold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">
                        96% Trust Score
                      </span>
                    </div>
                  </div>
                </div>

                {/* Included Services Checkboxes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2 font-mono-tech">
                    Included Services & Value Additions
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {serviceOptions.map((service) => {
                      const isChecked = includedServices.includes(service);
                      return (
                        <motion.label
                          key={service}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer font-mono-tech transition-all ${
                            isChecked
                              ? 'bg-indigo-950/80 border-indigo-800/80 text-indigo-300 font-medium'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleServiceToggle(service)}
                            className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-950"
                          />
                          <span>{service}</span>
                        </motion.label>
                      );
                    })}
                  </div>
                </div>

                {/* Notes Textarea */}
                <div>
                  <Textarea
                    label="Quotation Message & Value Proposition"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Describe your quality standards, material specs, or custom options..."
                    helperText="This message is shown to the customer on the offer comparison screen."
                  />
                </div>

                {/* Live Offer Card Preview */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block font-mono-tech">
                    Live Preview: How Customer Will See Your Offer
                  </span>
                  <motion.div
                    layout
                    className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3 font-mono-tech"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                          {user?.companyName?.charAt(0) || 'P'}
                        </div>
                        <div>
                          <strong className="text-xs font-bold text-white block">
                            {user?.companyName || user?.name || 'PrintHub Supplies'}
                          </strong>
                          <span className="text-[11px] text-slate-400">⭐ 4.8 Rating • 96% Trust</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">Offered Price</span>
                        <motion.span
                          key={price}
                          initial={{ scale: 1.1, color: '#6366f1' }}
                          animate={{ scale: 1, color: '#6366f1' }}
                          className="text-base font-extrabold block text-indigo-400"
                        >
                          {formatCurrency(price)}
                        </motion.span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="bg-emerald-950/80 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-800/50">
                        {matchScore}% Match Score
                      </span>
                      {badges.map((b, idx) => (
                        <span
                          key={idx}
                          className="bg-indigo-950/80 text-indigo-300 px-2 py-0.5 rounded font-semibold border border-indigo-800/50"
                        >
                          {b}
                        </span>
                      ))}
                      <span className="text-slate-400">Delivery in {deliveryDays} Days</span>
                      <span className="text-slate-400">• {warranty} Warranty</span>
                    </div>
                  </motion.div>
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex justify-end gap-3 font-mono-tech">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-slate-800 text-slate-300 hover:bg-slate-900"
                    onClick={() => navigate(`/vendor/opportunities/${requirement.id}`)}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                    className="px-8 bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Quotation
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default SubmitOfferPage;

