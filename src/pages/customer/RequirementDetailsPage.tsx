import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  MapPin,
  DollarSign,
  Package,
  FileText,
  Paperclip,
  CheckCircle2,
  ArrowRightLeft,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { useRequirementStore } from '../../stores/useRequirementStore';
import { useOfferStore } from '../../stores/useOfferStore';
import { OfferCard } from '../../components/shared/OfferCard';
import { Button, StatusBadge, Card, Modal } from '../../components/ui';
import { Offer } from '../../types';
import { PageContainer } from '../../components/layout/PageContainer';
import { PageHero } from '../../components/layout/PageHero';

export const RequirementDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { getRequirementById } = useRequirementStore();
  const { getOffersByRequirementId, acceptOffer } = useOfferStore();

  const requirement = id ? getRequirementById(id) : undefined;
  const rawOffers = id ? getOffersByRequirementId(id) : [];

  const [sortBy, setSortBy] = useState<'match' | 'price' | 'delivery' | 'rating'>('match');
  const [selectedOfferForAccept, setSelectedOfferForAccept] = useState<Offer | null>(null);
  const [isSubmittingAccept, setIsSubmittingAccept] = useState(false);

  if (!requirement) {
    return (
      <PageContainer className="text-center py-16">
        <h2 className="text-2xl font-bold text-[#F5F7FF]">Requirement Not Found</h2>
        <p className="text-[#9DA9C6] mt-2 mb-6">
          The requested requirement ID ({id}) could not be found.
        </p>
        <Button variant="primary" onClick={() => navigate('/customer/requirements')}>
          Back to My Requirements
        </Button>
      </PageContainer>
    );
  }

  // Sort offers
  const offers = [...rawOffers].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'delivery') return a.deliveryDays - b.deliveryDays;
    if (sortBy === 'rating') return b.vendorRating - a.vendorRating;
    return b.matchScore - a.matchScore; // default 'match'
  });

  const formatPrice = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);

  const handleConfirmAcceptOffer = () => {
    if (!selectedOfferForAccept) return;
    setIsSubmittingAccept(true);

    setTimeout(() => {
      const res = acceptOffer(selectedOfferForAccept.id);
      setIsSubmittingAccept(false);
      setSelectedOfferForAccept(null);

      if (res?.orderId) {
        navigate(`/orders/${res.orderId}`);
      } else {
        navigate('/customer/orders');
      }
    }, 600);
  };

  const bestValueOffer = offers.find((o) => o.badges?.includes('BEST VALUE'));

  return (
    <PageContainer>
      {/* Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <Link
          to="/customer/dashboard"
          className="inline-flex items-center text-xs font-mono-tech text-[#9DA9C6] hover:text-[#F5F7FF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Dashboard
        </Link>

        {offers.length > 1 && (
          <Button
            variant="primary"
            leftIcon={<ArrowRightLeft className="w-4 h-4" />}
            onClick={() => navigate(`/customer/requirements/${requirement.id}/compare`)}
          >
            Compare Offers Side-by-Side
          </Button>
        )}
      </div>

      {/* Main Requirement Overview Header */}
      <Card variant="elevated" className="mb-8 p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-white/8">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono-tech font-bold text-[#6B8CFF] bg-[#5B37F5]/15 px-2.5 py-1 rounded-md border border-[#5B37F5]/30">
                {requirement.id}
              </span>
              <StatusBadge status={requirement.status} size="md" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#F5F7FF] mt-2">
              {requirement.title}
            </h1>
            <p className="text-sm text-[#9DA9C6] mt-1 font-mono-tech">
              Category: <span className="font-semibold text-[#F5F7FF]">{requirement.category}</span> • Posted on{' '}
              {requirement.createdAt}
            </p>
          </div>

          <div className="text-right bg-[#131A32] p-4 rounded-xl border border-white/10 min-w-[200px] font-mono-tech">
            <span className="text-[10px] font-semibold text-[#6F7D9C] uppercase tracking-wider block">
              Budget Range
            </span>
            <span className="text-xl font-extrabold text-[#2BD696] mt-0.5 block font-sans">
              {formatPrice(requirement.minBudget)} - {formatPrice(requirement.maxBudget)}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-white/8 font-mono-tech">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#5B37F5]/15 text-[#6B8CFF] rounded-xl border border-[#5B37F5]/30">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#6F7D9C] block uppercase">Quantity</span>
              <span className="text-sm font-bold text-[#F5F7FF]">
                {requirement.quantity} {requirement.unit}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#2BD696]/15 text-[#2BD696] rounded-xl border border-[#2BD696]/30">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#6F7D9C] block uppercase">Target Budget</span>
              <span className="text-sm font-bold text-[#2BD696]">
                {formatPrice(requirement.maxBudget)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#FAB505]/15 text-[#FAB505] rounded-xl border border-[#FAB505]/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#6F7D9C] block uppercase">Deadline</span>
              <span className="text-sm font-bold text-[#F5F7FF]">{requirement.deadline}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#48CBFF]/15 text-[#48CBFF] rounded-xl border border-[#48CBFF]/30">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#6F7D9C] block uppercase">Location</span>
              <span className="text-sm font-bold text-[#F5F7FF]">{requirement.location}</span>
            </div>
          </div>
        </div>

        {/* Description & Specifications */}
        <div className="pt-6 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-[#9DA9C6] uppercase tracking-wider flex items-center gap-2 mb-2 font-mono-tech">
              <FileText className="w-4 h-4 text-[#6B8CFF]" /> Description & Scope
            </h3>
            <p className="text-sm text-[#F5F7FF] leading-relaxed bg-[#131A32] p-4 rounded-xl border border-white/8">
              {requirement.description}
            </p>
          </div>

          {requirement.specifications.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-[#9DA9C6] uppercase tracking-wider mb-2 font-mono-tech">
                Technical Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {requirement.specifications.map((spec, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-xs font-medium text-[#F5F7FF] bg-[#131A32] p-3 rounded-xl border border-white/8 font-mono-tech"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#2BD696] shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {requirement.attachments && requirement.attachments.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-[#9DA9C6] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono-tech">
                <Paperclip className="w-4 h-4 text-[#6F7D9C]" /> Attachments
              </h3>
              <div className="flex flex-wrap gap-2">
                {requirement.attachments.map((file, i) => (
                  <div
                    key={i}
                    className="inline-flex items-center gap-2 text-xs bg-[#131A32] text-[#F5F7FF] px-3 py-1.5 rounded-lg border border-white/10 font-mono-tech"
                  >
                    <Paperclip className="w-3.5 h-3.5 text-[#6F7D9C]" />
                    <span>{file}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* OFFERS RECEIVED SECTION */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-white/8">
          <div>
            <h2 className="text-xl font-bold text-[#F5F7FF] flex items-center gap-2">
              Offers Received
              <span className="text-xs bg-[#5B37F5]/20 text-[#6B8CFF] px-2.5 py-0.5 rounded-full font-mono-tech font-bold">
                {offers.length} Vendors Responded
              </span>
            </h2>
            <p className="text-xs text-[#9DA9C6] mt-0.5">
              Review quotations, compare options side-by-side, and choose the best offer.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {offers.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<ArrowRightLeft className="w-4 h-4" />}
                onClick={() => navigate(`/customer/requirements/${requirement.id}/compare`)}
              >
                Compare ({offers.length})
              </Button>
            )}

            <div className="flex items-center gap-2 text-xs text-[#9DA9C6] bg-[#0F1428] px-3 py-2 rounded-xl border border-white/10 font-mono-tech">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#6F7D9C]" />
              <span className="font-semibold">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort offers by"
                className="bg-transparent font-bold text-[#6B8CFF] focus:outline-none cursor-pointer"
              >
                <option value="match" className="bg-[#0F1428]">Best Match</option>
                <option value="price" className="bg-[#0F1428]">Lowest Price</option>
                <option value="delivery" className="bg-[#0F1428]">Fastest Delivery</option>
                <option value="rating" className="bg-[#0F1428]">Highest Rated Vendor</option>
              </select>
            </div>
          </div>
        </div>

        {/* Offers Grid */}
        {offers.length === 0 ? (
          <Card className="text-center py-12">
            <Clock className="w-12 h-12 text-[#6F7D9C] mx-auto mb-3 animate-pulse" />
            <h3 className="text-lg font-bold text-[#F5F7FF]">Waiting for Vendor Quotations</h3>
            <p className="text-sm text-[#9DA9C6] max-w-md mx-auto mt-1">
              Your requirement is active on the vendor marketplace. Offers will appear here automatically as vendors respond.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                isBestValue={offer.id === bestValueOffer?.id}
                onCompare={() => navigate(`/customer/requirements/${requirement.id}/compare`)}
                onAccept={(off) => setSelectedOfferForAccept(off)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Accept Offer Confirmation Modal */}
      <Modal
        isOpen={!!selectedOfferForAccept}
        onClose={() => setSelectedOfferForAccept(null)}
        title="Confirm Offer Acceptance"
        description="Accepting this quotation will create an active order with the vendor."
      >
        {selectedOfferForAccept && (
          <div className="space-y-4">
            <div className="bg-[#131A32] p-4 rounded-xl border border-white/8 font-mono-tech">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#6F7D9C] uppercase">Vendor</span>
                <span className="font-bold text-[#F5F7FF]">{selectedOfferForAccept.vendorName}</span>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/8">
                <span className="text-xs font-semibold text-[#6F7D9C] uppercase">Agreed Amount</span>
                <span className="text-lg font-extrabold text-[#2BD696] font-sans">
                  {formatPrice(selectedOfferForAccept.price)}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/8">
                <span className="text-xs font-semibold text-[#6F7D9C] uppercase">Estimated Delivery</span>
                <span className="text-sm font-semibold text-[#F5F7FF]">
                  {selectedOfferForAccept.deliveryDays} Days
                </span>
              </div>
            </div>

            <div className="bg-[#2BD696]/15 p-3 rounded-xl border border-[#2BD696]/30 text-xs text-[#2BD696] flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-[#2BD696] shrink-0 mt-0.5" />
              <span>
                Once confirmed, an order will be generated and the vendor will begin order fulfillment.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setSelectedOfferForAccept(null)}
                disabled={isSubmittingAccept}
              >
                Cancel
              </Button>
              <Button
                variant="success"
                onClick={handleConfirmAcceptOffer}
                isLoading={isSubmittingAccept}
              >
                Confirm & Create Order
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default RequirementDetailsPage;
