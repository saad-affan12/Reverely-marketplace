import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useRequirementStore } from '../../stores/useRequirementStore';
import { useOfferStore } from '../../stores/useOfferStore';
import { OfferComparison } from '../../components/shared/OfferComparison';
import { Button, Modal, Card } from '../../components/ui';
import { Offer } from '../../types';
import { PageContainer } from '../../components/layout/PageContainer';
import { PageHero } from '../../components/layout/PageHero';

export const CompareOffersPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { getRequirementById } = useRequirementStore();
  const { getOffersByRequirementId, acceptOffer } = useOfferStore();

  const requirement = id ? getRequirementById(id) : undefined;
  const offers = id ? getOffersByRequirementId(id) : [];

  const [selectedOfferForAccept, setSelectedOfferForAccept] = useState<Offer | null>(null);
  const [isSubmittingAccept, setIsSubmittingAccept] = useState(false);

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
    }, 500);
  };

  return (
    <PageContainer>
      <Link
        to={`/customer/requirements/${requirement.id}`}
        className="inline-flex items-center text-xs font-mono-tech font-semibold text-[#9DA9C6] hover:text-[#F5F7FF] transition-colors mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Requirement Details
      </Link>

      <PageHero
        eyebrow={`${offers.length} Verified Vendors`}
        title="Compare"
        titleHighlight="Offers"
        description={`Evaluating vendor proposals side-by-side for ${requirement.title} (${requirement.id})`}
        bgText="COMPARE"
        action={
          <Button
            variant="outline"
            onClick={() => navigate(`/customer/requirements/${requirement.id}`)}
          >
            View Full Requirement
          </Button>
        }
      />

      <OfferComparison
        offers={offers}
        requirement={requirement}
        onAcceptOffer={(offerId) => {
          const off = offers.find((o) => o.id === offerId);
          if (off) setSelectedOfferForAccept(off);
        }}
      />

      {/* Accept Offer Modal */}
      <Modal
        isOpen={!!selectedOfferForAccept}
        onClose={() => setSelectedOfferForAccept(null)}
        title="Confirm Offer Acceptance"
        description="Accepting this proposal creates an official order with the vendor."
      >
        {selectedOfferForAccept && (
          <div className="space-y-4 font-mono-tech">
            <div className="bg-[#131A32] p-5 rounded-2xl border border-white/8 space-y-3 text-xs">
              <div className="flex justify-between items-center text-[#6F7D9C]">
                <span>Selected Vendor:</span>
                <span className="font-bold text-[#F5F7FF] font-sans text-sm">{selectedOfferForAccept.vendorName}</span>
              </div>
              <div className="flex justify-between items-center text-[#6F7D9C] pt-2 border-t border-white/8">
                <span>Final Agreed Price:</span>
                <span className="text-base font-extrabold text-[#2BD696] font-sans">
                  {formatPrice(selectedOfferForAccept.price)}
                </span>
              </div>
              <div className="flex justify-between items-center text-[#6F7D9C] pt-2 border-t border-white/8">
                <span>Promised Delivery:</span>
                <span className="font-semibold text-[#F5F7FF]">{selectedOfferForAccept.deliveryDays} Days</span>
              </div>
            </div>

            <div className="bg-[#2BD696]/15 p-4 rounded-xl border border-[#2BD696]/30 text-xs text-[#2BD696] flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#2BD696] shrink-0 mt-0.5" />
              <span>
                Order timeline tracking will immediately start upon confirmation.
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-2">
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

export default CompareOffersPage;
