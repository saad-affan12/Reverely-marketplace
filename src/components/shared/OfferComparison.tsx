import React from 'react';
import { Star, ShieldCheck, Clock, Award, CheckCircle2, Check, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Offer, Requirement } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface OfferComparisonProps {
  offers: Offer[];
  requirement: Requirement;
  onAcceptOffer: (offerId: string) => void;
  className?: string;
}

export const OfferComparison: React.FC<OfferComparisonProps> = ({
  offers,
  requirement,
  onAcceptOffer,
  className = '',
}) => {
  if (offers.length === 0) {
    return (
      <Card className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-[#6F7D9C] mx-auto mb-3" />
        <h3 className="text-lg font-bold text-[#F5F7FF]">No offers to compare yet</h3>
        <p className="text-sm text-[#9DA9C6] max-w-md mx-auto mt-1">
          Vendors are currently reviewing your requirement. Once quotations arrive, you can compare them side-by-side here.
        </p>
      </Card>
    );
  }

  // Find lowest price and highest rating to highlight
  const lowestPrice = Math.min(...offers.map((o) => o.price));
  const bestMatchOffer = [...offers].sort((a, b) => b.matchScore - a.matchScore)[0];
  const recommendedOffer = offers.find((o) => o.badges?.includes('BEST VALUE')) || bestMatchOffer;

  const formatPrice = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Recommended Offer Banner Callout */}
      {recommendedOffer && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-r from-[#5B37F5]/20 via-[#0F1428] to-[#131A32] text-[#F5F7FF] rounded-2xl p-6 shadow-2xl border border-[#5B37F5]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden"
        >
          <div className="flex items-start gap-3.5 relative z-10">
            <div className="p-3 bg-[#5B37F5]/30 rounded-xl border border-[#5B37F5]/50 text-[#FAB505] shrink-0 mt-0.5 shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B8CFF] font-mono-tech">
                  AI Recommended Choice
                </span>
                <Badge variant="success" size="sm" className="font-bold">
                  BEST VALUE
                </Badge>
              </div>
              <h3 className="text-lg font-bold text-[#F5F7FF] mt-1">
                {recommendedOffer.vendorName} Quote — <span className="text-[#2BD696]">{formatPrice(recommendedOffer.price)}</span>
              </h3>
              <p className="text-xs text-[#9DA9C6] mt-1 max-w-xl leading-relaxed">
                Reasoning: Within your budget of {formatPrice(requirement.maxBudget)}, offers a fast{' '}
                {recommendedOffer.deliveryDays}-day delivery, high {recommendedOffer.vendorTrustScore}% trust score, and a{' '}
                {recommendedOffer.matchScore}% requirement match score.
              </p>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="relative z-10">
            <Button
              variant="success"
              onClick={() => onAcceptOffer(recommendedOffer.id)}
              leftIcon={<Check className="w-4 h-4" />}
            >
              Accept Best Value Offer
            </Button>
          </motion.div>
        </motion.div>
      )}

      {/* Side-by-Side Comparison Table Container */}
      <Card className="overflow-hidden p-0 border border-white/8 shadow-2xl bg-[#0F1428]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#0B1020] border-b border-white/8">
                <th className="p-4 w-48 text-xs font-bold text-[#9DA9C6] uppercase tracking-wider bg-[#0B1020] border-r border-white/8 sticky left-0 z-10 font-mono-tech">
                  Feature / Criteria
                </th>
                {offers.map((offer) => {
                  const isBest = offer.id === recommendedOffer?.id;
                  return (
                    <th
                      key={offer.id}
                      className={`p-4 min-w-[220px] text-center border-r border-white/8 last:border-r-0 ${
                        isBest ? 'bg-[#5B37F5]/10' : 'bg-[#0F1428]'
                      }`}
                    >
                      {isBest && (
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#2BD696]/20 text-[#2BD696] text-[10px] font-bold mb-2 border border-[#2BD696]/30 uppercase font-mono-tech">
                          <Award className="w-3 h-3" /> Recommended
                        </div>
                      )}
                      <div className="font-bold text-[#F5F7FF] text-base flex items-center justify-center gap-1.5">
                        {offer.vendorName}
                        <ShieldCheck className="w-4 h-4 text-[#2BD696] shrink-0" />
                      </div>
                      <div className="flex items-center justify-center gap-2 text-xs text-[#9DA9C6] mt-1 font-mono-tech">
                        <span className="flex items-center font-semibold text-[#FAB505]">
                          <Star className="w-3 h-3 fill-[#FAB505] text-[#FAB505] mr-0.5" />
                          {offer.vendorRating.toFixed(1)}
                        </span>
                        <span>•</span>
                        <span className="text-[#2BD696] font-medium">{offer.vendorTrustScore}% Trust</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-white/6 text-sm">
              {/* Row 1: Quoted Price */}
              <tr className="hover:bg-white/4 transition-colors">
                <td className="p-4 font-bold text-[#F5F7FF] bg-[#0F1428] border-r border-white/8 sticky left-0 z-10 font-mono-tech">
                  Quoted Price
                </td>
                {offers.map((offer) => {
                  const isLowest = offer.price === lowestPrice;
                  return (
                    <td
                      key={offer.id}
                      className={`p-4 text-center border-r border-white/8 last:border-r-0 font-mono-tech ${
                        isLowest ? 'bg-[#2BD696]/10 font-bold' : ''
                      }`}
                    >
                      <div className="text-lg font-extrabold text-[#2BD696]">
                        {formatPrice(offer.price)}
                      </div>
                      {isLowest && (
                        <span className="inline-block mt-1 text-[10px] font-semibold text-[#2BD696] bg-[#2BD696]/20 px-2 py-0.5 rounded-full border border-[#2BD696]/30 uppercase">
                          Lowest Price
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Row 2: Match Score */}
              <tr className="hover:bg-white/4 transition-colors">
                <td className="p-4 font-bold text-[#F5F7FF] bg-[#0F1428] border-r border-white/8 sticky left-0 z-10 font-mono-tech">
                  Match Score
                </td>
                {offers.map((offer) => (
                  <td key={offer.id} className="p-4 text-center border-r border-white/8 last:border-r-0 font-mono-tech">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#5B37F5]/20 border border-[#5B37F5]/40 text-[#6B8CFF] font-bold text-xs">
                      {offer.matchScore}% Match
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 3: Delivery Time */}
              <tr className="hover:bg-white/4 transition-colors">
                <td className="p-4 font-bold text-[#F5F7FF] bg-[#0F1428] border-r border-white/8 sticky left-0 z-10 font-mono-tech">
                  Delivery Time
                </td>
                {offers.map((offer) => (
                  <td key={offer.id} className="p-4 text-center font-medium text-[#F5F7FF] border-r border-white/8 last:border-r-0 font-mono-tech">
                    <span className="inline-flex items-center gap-1 font-semibold text-[#F5F7FF]">
                      <Clock className="w-3.5 h-3.5 text-[#6B8CFF]" />
                      {offer.deliveryDays} Days
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 4: Warranty */}
              <tr className="hover:bg-white/4 transition-colors">
                <td className="p-4 font-bold text-[#F5F7FF] bg-[#0F1428] border-r border-white/8 sticky left-0 z-10 font-mono-tech">
                  Warranty
                </td>
                {offers.map((offer) => (
                  <td key={offer.id} className="p-4 text-center font-medium text-[#9DA9C6] border-r border-white/8 last:border-r-0 font-mono-tech">
                    {offer.warranty}
                  </td>
                ))}
              </tr>

              {/* Row 5: Included Services */}
              <tr className="hover:bg-white/4 transition-colors">
                <td className="p-4 font-bold text-[#F5F7FF] bg-[#0F1428] border-r border-white/8 sticky left-0 z-10 font-mono-tech">
                  Included Services
                </td>
                {offers.map((offer) => (
                  <td key={offer.id} className="p-4 border-r border-white/8 last:border-r-0">
                    <ul className="text-xs space-y-1.5 text-[#9DA9C6] max-w-[180px] mx-auto text-left">
                      {offer.includedServices.map((service, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2BD696] shrink-0 mt-0.5" />
                          <span>{service}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Row 6: Vendor Notes */}
              <tr className="hover:bg-white/4 transition-colors">
                <td className="p-4 font-bold text-[#F5F7FF] bg-[#0F1428] border-r border-white/8 sticky left-0 z-10 font-mono-tech">
                  Vendor Notes
                </td>
                {offers.map((offer) => (
                  <td key={offer.id} className="p-4 text-center text-xs text-[#9DA9C6] italic border-r border-white/8 last:border-r-0">
                    "{offer.notes}"
                  </td>
                ))}
              </tr>

              {/* Row 7: Action Row */}
              <tr className="bg-[#0B1020]/90">
                <td className="p-4 font-bold text-[#F5F7FF] bg-[#0B1020] border-r border-white/8 sticky left-0 z-10 font-mono-tech">
                  Action
                </td>
                {offers.map((offer) => (
                  <td key={offer.id} className="p-4 text-center border-r border-white/8 last:border-r-0">
                    {offer.status === 'accepted' ? (
                      <Badge variant="success" size="md" className="font-bold py-1.5 px-4">
                        <Check className="w-4 h-4 mr-1" /> Accepted
                      </Badge>
                    ) : (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => onAcceptOffer(offer.id)}
                        className="w-full justify-center"
                      >
                        Accept Offer
                      </Button>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
