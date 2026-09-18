import React from 'react';
import { Star, ShieldCheck, Clock, Award, CheckCircle2, ArrowRightLeft, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { Offer } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface OfferCardProps {
  offer: Offer;
  onViewDetails?: (offer: Offer) => void;
  onCompare?: (offer: Offer) => void;
  onAccept?: (offer: Offer) => void;
  isBestValue?: boolean;
  showActions?: boolean;
  className?: string;
}

export const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  onViewDetails,
  onCompare,
  onAccept,
  isBestValue = false,
  showActions = true,
  className = '',
}) => {
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(offer.price);

  const isBest = isBestValue || offer.badges?.includes('BEST VALUE');

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`relative bg-[#0F1428]/90 backdrop-blur-xl rounded-2xl border p-6 shadow-xl transition-all ${
        isBest
          ? 'border-[#5B37F5]/50 ring-2 ring-[#5B37F5]/30 bg-gradient-to-b from-[#5B37F5]/10 to-[#0F1428]'
          : 'border-white/10 hover:border-white/20'
      } ${className}`}
    >
      {/* Top Banner Badges */}
      {offer.badges && offer.badges.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {offer.badges.map((badge, idx) => {
            let variant: 'primary' | 'success' | 'info' = 'primary';
            if (badge === 'BEST VALUE') variant = 'success';
            if (badge === 'FASTEST DELIVERY') variant = 'info';
            if (badge === 'TOP RATED') variant = 'primary';

            return (
              <motion.div
                key={badge}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Badge variant={variant} size="sm" className="font-semibold tracking-wide">
                  <Award className="w-3 h-3 mr-1" />
                  {badge}
                </Badge>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Main Vendor Info & Match Score */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/8">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="w-11 h-11 rounded-xl bg-[#5B37F5] text-white font-bold flex items-center justify-center text-sm border border-white/20 shadow-md shrink-0 font-mono-tech"
          >
            {offer.vendorName.substring(0, 2).toUpperCase()}
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-[#F5F7FF] hover:text-[#6B8CFF] transition-colors">
                {offer.vendorName}
              </h4>
              <ShieldCheck className="w-4 h-4 text-[#2BD696] shrink-0" aria-label="Verified Vendor" />
            </div>
            <div className="flex items-center gap-3 text-xs text-[#9DA9C6] mt-0.5 font-mono-tech">
              <span className="flex items-center text-[#FAB505] font-semibold">
                <Star className="w-3.5 h-3.5 fill-[#FAB505] text-[#FAB505] mr-1 shrink-0" />
                {offer.vendorRating.toFixed(1)}
              </span>
              <span>•</span>
              <span className="text-[#2BD696] font-medium bg-[#2BD696]/15 px-2 py-0.5 rounded-full border border-[#2BD696]/30">
                {offer.vendorTrustScore}% Trust Score
              </span>
            </div>
          </div>
        </div>

        {/* Match Score */}
        <div className="text-right shrink-0">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex items-center px-2.5 py-1 rounded-xl bg-[#5B37F5]/20 border border-[#5B37F5]/40 text-[#6B8CFF] text-xs font-bold font-mono-tech"
          >
            {offer.matchScore}% Match
          </motion.div>
        </div>
      </div>

      {/* Pricing & Key Offer Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-4 my-1 bg-[#131A32]/80 -mx-6 px-6 border-y border-white/8 font-mono-tech">
        <div>
          <span className="text-[10px] text-[#6F7D9C] block uppercase font-medium tracking-wider">
            Quoted Price
          </span>
          <span className="text-xl font-extrabold text-[#2BD696] mt-0.5 block tracking-tight">
            {formattedPrice}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-[#6F7D9C] block uppercase font-medium tracking-wider">
            Delivery Time
          </span>
          <span className="text-sm font-semibold text-[#F5F7FF] mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#6B8CFF]" />
            {offer.deliveryDays} Days
          </span>
        </div>

        <div>
          <span className="text-[10px] text-[#6F7D9C] block uppercase font-medium tracking-wider">
            Warranty
          </span>
          <span className="text-sm font-semibold text-[#F5F7FF] mt-1 block">
            {offer.warranty}
          </span>
        </div>
      </div>

      {/* Included Services & Notes */}
      <div className="pt-3">
        {offer.includedServices.length > 0 && (
          <div className="mb-3">
            <span className="text-[10px] uppercase font-mono-tech text-[#6F7D9C] block mb-1.5">
              Included Services:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {offer.includedServices.map((service, index) => (
                <span
                  key={index}
                  className="inline-flex items-center text-xs bg-[#131A32] text-[#F5F7FF] px-2.5 py-1 rounded-lg border border-white/10"
                >
                  <CheckCircle2 className="w-3 h-3 text-[#2BD696] mr-1.5 shrink-0" />
                  {service}
                </span>
              ))}
            </div>
          </div>
        )}

        {offer.notes && (
          <p className="text-xs text-[#9DA9C6] bg-[#131A32] p-3 rounded-xl border border-white/8 italic line-clamp-2 leading-relaxed">
            "{offer.notes}"
          </p>
        )}
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex flex-wrap items-center justify-between gap-2 mt-5 pt-3.5 border-t border-white/8">
          <div className="flex items-center gap-2">
            {onViewDetails && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewDetails(offer)}
                className="text-xs font-medium"
              >
                View Details
              </Button>
            )}
            {onCompare && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCompare(offer)}
                leftIcon={<ArrowRightLeft className="w-3.5 h-3.5 text-[#6B8CFF]" />}
                className="text-xs"
              >
                Compare
              </Button>
            )}
          </div>

          {onAccept && offer.status === 'pending' && (
            <motion.div whileTap={{ scale: 0.96 }}>
              <Button
                variant="success"
                size="sm"
                onClick={() => onAccept(offer)}
                leftIcon={<Check className="w-3.5 h-3.5" />}
              >
                Accept Offer
              </Button>
            </motion.div>
          )}

          {offer.status === 'accepted' && (
            <Badge variant="success" size="md" className="font-bold py-1 px-3">
              <Check className="w-3.5 h-3.5 mr-1" />
              ACCEPTED OFFER
            </Badge>
          )}
        </div>
      )}
    </motion.div>
  );
};
