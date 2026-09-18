import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Tag, ArrowRight, MessageSquare } from 'lucide-react';
import { Requirement } from '../../types';
import { Card, StatusBadge, Button } from '../ui';

interface RequirementCardProps {
  requirement: Requirement;
  showActions?: boolean;
}

export const RequirementCard: React.FC<RequirementCardProps> = ({
  requirement,
  showActions = true,
}) => {
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card variant="interactive" className="flex flex-col justify-between h-full group">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <span className="text-[10px] font-bold text-[#6B8CFF] bg-[#5B37F5]/15 border border-[#5B37F5]/30 px-2 py-0.5 rounded-full uppercase tracking-widest font-mono-tech">
              {requirement.category}
            </span>
            <h3 className="text-lg font-bold text-[#F5F7FF] mt-2 line-clamp-1 group-hover:text-[#6B8CFF] transition-colors">
              {requirement.title}
            </h3>
          </div>
          <StatusBadge status={requirement.status} size="sm" />
        </div>

        <p className="text-xs sm:text-sm text-[#9DA9C6] line-clamp-2 mb-4 leading-relaxed">
          {requirement.description}
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs text-[#9DA9C6] mb-4 bg-[#131A32] p-3 rounded-xl border border-white/8 font-mono-tech">
          <div className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-[#6F7D9C]" />
            <span>Qty: <strong className="text-[#F5F7FF]">{requirement.quantity} {requirement.unit}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#6F7D9C]" />
            <span className="truncate">{requirement.location}</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2">
            <Calendar className="w-3.5 h-3.5 text-[#6F7D9C]" />
            <span>Need by: <strong className="text-[#F5F7FF]">{requirement.deadline}</strong></span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8 pt-3.5 mt-auto">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <span className="text-[10px] uppercase font-mono-tech text-[#6F7D9C] block">Max Budget</span>
            <span className="text-lg font-extrabold text-[#2BD696]">
              {formatCurrency(requirement.maxBudget)}
            </span>
          </div>
          <div className="flex items-center gap-1 bg-[#5B37F5]/15 text-[#6B8CFF] px-2.5 py-1 rounded-full text-xs font-semibold border border-[#5B37F5]/30 font-mono-tech">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{requirement.offersCount} Offers</span>
          </div>
        </div>

        {showActions && (
          <Button
            variant="secondary"
            size="sm"
            className="w-full justify-center group/btn"
            onClick={() => navigate(`/customer/requirements/${requirement.id}`)}
          >
            <span>View Requirement</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        )}
      </div>
    </Card>
  );
};
