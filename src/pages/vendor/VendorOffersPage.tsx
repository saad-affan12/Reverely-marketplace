import React from 'react';
import { useOfferStore } from '../../stores/useOfferStore';
import { Card, Badge, StatusBadge, Button } from '../../components/ui';
import { PageContainer, PageHero } from '../../components/layout';
import { Award, Clock, DollarSign, Tag, FileText } from 'lucide-react';

export const VendorOffersPage: React.FC = () => {
  const offers = useOfferStore((state) => state.offers);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <PageContainer bgText="QUOTATIONS">
      <div className="space-y-8">
        <PageHero
          eyebrow="VENDOR PROPOSALS ENGINE"
          title="Submitted Quotations"
          titleHighlight="& Quotes"
          description="Track active quotations, response statuses, match scores, and delivery commitments submitted to customers."
          bgText="QUOTATIONS"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <Card key={offer.id} variant="interactive" className="p-6 space-y-4 border-slate-800 font-mono-tech">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400">{offer.id}</span>
                <Badge variant={offer.status === 'accepted' ? 'success' : 'info'}>
                  {offer.status.toUpperCase()}
                </Badge>
              </div>

              <div>
                <div className="text-xs text-slate-400">Requirement Reference</div>
                <div className="font-semibold text-white text-sm mt-0.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{offer.requirementId}</span>
                </div>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Quote Price</span>
                <span className="text-lg font-bold text-indigo-400">
                  {formatCurrency(offer.price)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{offer.deliveryDays} Days Lead Time</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{offer.matchScore}% Match</span>
                </div>
              </div>

              {offer.badges && offer.badges.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
                  {offer.badges.map((b) => (
                    <span
                      key={b}
                      className="text-[10px] bg-indigo-950/80 text-indigo-300 border border-indigo-800/50 px-2 py-0.5 rounded font-semibold"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};

export default VendorOffersPage;

