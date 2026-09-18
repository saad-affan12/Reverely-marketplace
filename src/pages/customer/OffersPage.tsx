import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRightLeft, Filter, Sparkles } from 'lucide-react';
import { useRequirementStore } from '../../stores/useRequirementStore';
import { useOfferStore } from '../../stores/useOfferStore';
import { OfferCard } from '../../components/shared/OfferCard';
import { Button, Modal, Card } from '../../components/ui';
import { Offer } from '../../types';
import { PageContainer } from '../../components/layout/PageContainer';
import { PageHero } from '../../components/layout/PageHero';

export const OffersPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { getRequirementById } = useRequirementStore();
  const { getOffersByRequirementId, acceptOffer } = useOfferStore();

  const requirement = id ? getRequirementById(id) : undefined;
  const rawOffers = id ? getOffersByRequirementId(id) : [];

  const [selectedBadgeFilter, setSelectedBadgeFilter] = useState<string>('ALL');
  const [selectedOfferForAccept, setSelectedOfferForAccept] = useState<Offer | null>(null);

  if (!requirement) {
    return (
      <PageContainer className="text-center py-16">
        <h2 className="text-xl font-bold text-[#F5F7FF]">Requirement Not Found</h2>
        <Button variant="primary" className="mt-4" onClick={() => navigate('/customer/dashboard')}>
          Go to Dashboard
        </Button>
      </PageContainer>
    );
  }

  const filteredOffers = rawOffers.filter((o) => {
    if (selectedBadgeFilter === 'ALL') return true;
    return o.badges?.includes(selectedBadgeFilter as any);
  });

  const formatPrice = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);

  const handleConfirmAccept = () => {
    if (!selectedOfferForAccept) return;
    const res = acceptOffer(selectedOfferForAccept.id);
    setSelectedOfferForAccept(null);
    if (res?.orderId) {
      navigate(`/orders/${res.orderId}`);
    } else {
      navigate('/customer/orders');
    }
  };

  return (
    <PageContainer>
      <PageHero
        eyebrow="Marketplace Quotations"
        title="Offers for"
        titleHighlight={requirement.title}
        description={`Compare competitive quotations from verified vendors for requirement ${requirement.id}`}
        bgText="OFFERS"
        action={
          rawOffers.length > 1 ? (
            <Button
              variant="primary"
              leftIcon={<ArrowRightLeft className="w-4 h-4" />}
              onClick={() => navigate(`/customer/requirements/${requirement.id}/compare`)}
            >
              Compare All Side-by-Side
            </Button>
          ) : undefined
        }
      />

      {/* Filter Tabs */}
      <Card variant="elevated" className="mb-6 p-4 flex items-center gap-3 overflow-x-auto font-mono-tech">
        <span className="text-xs font-bold text-[#9DA9C6] uppercase tracking-wider flex items-center mr-2 shrink-0">
          <Filter className="w-3.5 h-3.5 mr-1.5 text-[#6B8CFF]" /> Filter Bids:
        </span>
        {['ALL', 'BEST VALUE', 'FASTEST DELIVERY', 'TOP RATED'].map((badge) => {
          const isSelected = selectedBadgeFilter === badge;
          return (
            <button
              key={badge}
              type="button"
              onClick={() => setSelectedBadgeFilter(badge)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-[#5B37F5] text-white border-[#5B37F5] shadow-md'
                  : 'bg-[#131A32] text-[#9DA9C6] border-white/8 hover:text-white'
              }`}
            >
              {badge}
            </button>
          );
        })}
      </Card>

      {/* Offers List */}
      {filteredOffers.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-[#9DA9C6]">No offers matching the selected filter.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOffers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onCompare={() => navigate(`/customer/requirements/${requirement.id}/compare`)}
              onAccept={(off) => setSelectedOfferForAccept(off)}
            />
          ))}
        </div>
      )}

      {/* Accept Offer Confirmation Modal */}
      <Modal
        isOpen={!!selectedOfferForAccept}
        onClose={() => setSelectedOfferForAccept(null)}
        title="Accept Offer & Create Order"
      >
        {selectedOfferForAccept && (
          <div className="space-y-4">
            <p className="text-sm text-[#9DA9C6] leading-relaxed">
              Are you sure you want to accept the offer from{' '}
              <strong className="text-[#F5F7FF]">{selectedOfferForAccept.vendorName}</strong> for{' '}
              <strong className="text-[#2BD696] font-mono-tech">{formatPrice(selectedOfferForAccept.price)}</strong>?
            </p>
            <div className="bg-[#2BD696]/15 p-4 rounded-xl border border-[#2BD696]/30 text-xs text-[#2BD696] font-mono-tech flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#2BD696] shrink-0" />
              <span>An official order will be created and 6-stage lifecycle tracking will begin.</span>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setSelectedOfferForAccept(null)}>
                Cancel
              </Button>
              <Button variant="success" onClick={handleConfirmAccept}>
                Confirm & Create Order
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default OffersPage;
