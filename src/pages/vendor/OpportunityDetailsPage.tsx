import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Tag,
  CheckCircle2,
  FileText,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { useRequirementStore } from '../../stores/useRequirementStore';
import { Card, Badge, Button, EmptyState, StatusBadge } from '../../components/ui';
import { PageContainer } from '../../components/layout';

export const OpportunityDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRequirementById } = useRequirementStore();

  const requirement = id ? getRequirementById(id) : undefined;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!requirement) {
    return (
      <PageContainer bgText="SPECS">
        <div className="py-12 flex items-center justify-center">
          <Card className="max-w-md w-full p-8 text-center border-slate-800">
            <EmptyState
              title="Opportunity Not Found"
              description="The requested requirement does not exist or has been removed."
              actionText="Back to Opportunities"
              onAction={() => navigate('/vendor/opportunities')}
            />
          </Card>
        </div>
      </PageContainer>
    );
  }

  // Calculate dummy match score based on requirement ID hash for consistency
  const getMatchScore = (reqId: string) => {
    let hash = 0;
    for (let i = 0; i < reqId.length; i++) {
      hash = reqId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return 85 + (Math.abs(hash) % 14); // 85% to 98%
  };

  const matchScore = getMatchScore(requirement.id);

  return (
    <PageContainer bgText="OPPORTUNITY">
      <div className="space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/vendor/opportunities')}
            className="inline-flex items-center text-xs font-mono-tech font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Opportunities
          </button>

          <div className="inline-flex items-center gap-1.5 bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 px-3 py-1 rounded-full text-xs font-mono-tech font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{matchScore}% Catalog Match</span>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Detailed Requirement Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <Card variant="default" className="p-6 md:p-8 space-y-6 border-slate-800">
              {/* Header Title & Status */}
              <div>
                <div className="flex items-center gap-2 mb-2 font-mono-tech">
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-800/50 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                    {requirement.category}
                  </span>
                  <span className="text-xs text-slate-500">
                    {requirement.id}
                  </span>
                  <StatusBadge status={requirement.status} />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {requirement.title}
                </h1>
                <p className="text-xs text-slate-400 font-mono-tech mt-1">
                  Posted by <strong className="text-slate-200">{requirement.customerName}</strong> • {requirement.createdAt}
                </p>
              </div>

              {/* Quick Spec Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs font-mono-tech">
                <div>
                  <span className="text-slate-500 block font-medium">Quantity</span>
                  <span className="text-white font-bold text-sm sm:text-base">
                    {requirement.quantity} {requirement.unit}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block font-medium">Max Budget</span>
                  <span className="text-indigo-400 font-bold text-sm sm:text-base">
                    {formatCurrency(requirement.maxBudget)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block font-medium">Deadline</span>
                  <span className="text-white font-bold text-sm sm:text-base">
                    {requirement.deadline}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block font-medium">Location</span>
                  <span className="text-white font-bold text-sm sm:text-base truncate block">
                    {requirement.location}
                  </span>
                </div>
              </div>

              {/* Detailed Description */}
              <div className="space-y-2 border-t border-slate-800 pt-5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>Customer Requirement Description</span>
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
                  {requirement.description}
                </p>
              </div>

              {/* Specifications List */}
              {requirement.specifications && requirement.specifications.length > 0 && (
                <div className="space-y-3 border-t border-slate-800 pt-5">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Required Technical Specifications</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {requirement.specifications.map((spec, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800 font-mono-tech"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attachments Section */}
              {requirement.attachments && requirement.attachments.length > 0 && (
                <div className="space-y-2 border-t border-slate-800 pt-5">
                  <h3 className="text-sm font-bold text-white">Reference Attachments</h3>
                  <div className="flex flex-wrap gap-2 font-mono-tech text-xs">
                    {requirement.attachments.map((att, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-slate-900 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-800"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span>{att}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column: Sticky Opportunity Action Sidebar */}
          <div className="space-y-6">
            <Card variant="elevated" className="p-6 space-y-6 sticky top-6 border-slate-800">
              <div className="space-y-2 pb-4 border-b border-slate-800 font-mono-tech">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  Opportunity Summary
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400">Customer Budget Ceiling</span>
                  <span className="text-2xl font-extrabold text-indigo-400">
                    {formatCurrency(requirement.maxBudget)}
                  </span>
                </div>
                {requirement.minBudget > 0 && (
                  <p className="text-xs text-slate-500 text-right">
                    Customer Budget Floor: {formatCurrency(requirement.minBudget)}
                  </p>
                )}
              </div>

              <div className="space-y-3 text-xs font-mono-tech text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <MessageSquare className="w-4 h-4 text-slate-500" />
                    <span>Existing Quotes</span>
                  </span>
                  <strong className="text-white">{requirement.offersCount} Vendors Responded</strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>Delivery Deadline</span>
                  </span>
                  <strong className="text-white">{requirement.deadline}</strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>Delivery Location</span>
                  </span>
                  <strong className="text-white">{requirement.location}</strong>
                </div>
              </div>

              <div className="bg-indigo-950/60 p-3.5 rounded-xl border border-indigo-800/50 text-xs text-indigo-200 space-y-1.5 font-mono-tech">
                <div className="flex items-center gap-1.5 font-bold text-indigo-300">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span>Why Quote on Reversely?</span>
                </div>
                <p className="text-slate-300 leading-normal">
                  Quotations under customer budget ceiling with fast delivery receive high Match Scores and Best Value badges on customer compare screens.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  variant="primary"
                  className="w-full justify-center py-3 text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                  onClick={() => navigate(`/vendor/opportunities/${requirement.id}/offer`)}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Quotation Offer
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-center text-xs border-slate-800 text-slate-300 hover:bg-slate-900"
                  onClick={() => navigate('/vendor/opportunities')}
                >
                  Browse Other Opportunities
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default OpportunityDetailsPage;
