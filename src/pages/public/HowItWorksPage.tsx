import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FilePlus,
  Send,
  Sliders,
  CheckCircle,
  Package,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { Button, Card } from '../../components/ui';
import { PageContainer } from '../../components/layout/PageContainer';
import { PageHero } from '../../components/layout/PageHero';

export const HowItWorksPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      {/* Page Hero Header */}
      <PageHero
        eyebrow="Reverse Marketplace Protocol"
        title="How"
        titleHighlight="Reversely Works"
        description="A revolutionary reverse multi-vendor marketplace where buyers state their terms and verified suppliers compete with custom proposals."
        bgText="CONTROL"
      />

      {/* CUSTOMER WORKFLOW */}
      <div className="mb-20">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#5B37F5] text-white flex items-center justify-center font-serif-editorial italic text-2xl font-bold shadow-lg shadow-[#5B37F5]/30">
            A
          </div>
          <div>
            <span className="text-xs font-mono-tech text-[#6B8CFF] uppercase tracking-wider block">Buyer Journey</span>
            <h2 className="text-2xl font-bold text-[#F5F7FF]">For Customers</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="elevated" className="space-y-4">
            <div className="w-11 h-11 rounded-xl bg-[#5B37F5]/15 border border-[#5B37F5]/30 text-[#6B8CFF] flex items-center justify-center">
              <FilePlus className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-[#F5F7FF]">1. Post Requirement</h3>
            <p className="text-xs text-[#9DA9C6] leading-relaxed">
              Specify quantity, budget ceiling, preferred delivery date, and custom specifications using our guided multi-step wizard.
            </p>
          </Card>

          <Card variant="elevated" className="space-y-4">
            <div className="w-11 h-11 rounded-xl bg-[#5B37F5]/15 border border-[#5B37F5]/30 text-[#6B8CFF] flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-[#F5F7FF]">2. Compare Quotations</h3>
            <p className="text-xs text-[#9DA9C6] leading-relaxed">
              Receive quotes from multiple verified vendors. Compare side-by-side on price, delivery timeline, warranty, and trust score.
            </p>
          </Card>

          <Card variant="elevated" className="space-y-4">
            <div className="w-11 h-11 rounded-xl bg-[#5B37F5]/15 border border-[#5B37F5]/30 text-[#6B8CFF] flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-[#F5F7FF]">3. Accept & Track</h3>
            <p className="text-xs text-[#9DA9C6] leading-relaxed">
              Accept your preferred offer to create an escrow-protected order. Track delivery through a 6-stage visual timeline stepper.
            </p>
          </Card>
        </div>
      </div>

      {/* VENDOR WORKFLOW */}
      <div className="mb-20">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#2BD696] text-[#050816] flex items-center justify-center font-serif-editorial italic text-2xl font-bold shadow-lg shadow-[#2BD696]/30">
            B
          </div>
          <div>
            <span className="text-xs font-mono-tech text-[#2BD696] uppercase tracking-wider block">Supplier Journey</span>
            <h2 className="text-2xl font-bold text-[#F5F7FF]">For Vendors</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="elevated" className="space-y-4">
            <div className="w-11 h-11 rounded-xl bg-[#2BD696]/15 border border-[#2BD696]/30 text-[#2BD696] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-[#F5F7FF]">1. Discover Opportunities</h3>
            <p className="text-xs text-[#9DA9C6] leading-relaxed">
              Browse qualified customer requirements matching your product category, location, and production capacity.
            </p>
          </Card>

          <Card variant="elevated" className="space-y-4">
            <div className="w-11 h-11 rounded-xl bg-[#2BD696]/15 border border-[#2BD696]/30 text-[#2BD696] flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-[#F5F7FF]">2. Submit Quote</h3>
            <p className="text-xs text-[#9DA9C6] leading-relaxed">
              Submit competitive price, estimated delivery duration, warranty terms, and extra included services to win the business.
            </p>
          </Card>

          <Card variant="elevated" className="space-y-4">
            <div className="w-11 h-11 rounded-xl bg-[#2BD696]/15 border border-[#2BD696]/30 text-[#2BD696] flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-[#F5F7FF]">3. Fulfill & Grow</h3>
            <p className="text-xs text-[#9DA9C6] leading-relaxed">
              Upon customer acceptance, fulfill the order, update stage status, and build your vendor rating and marketplace trust score.
            </p>
          </Card>
        </div>
      </div>

      {/* CTA BANNER */}
      <div className="bg-gradient-to-b from-[#131A32] to-[#0F1428] rounded-3xl p-8 sm:p-14 text-center border border-white/10 shadow-2xl">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F7FF] mb-4 tracking-tight">
          Ready to experience the reverse marketplace?
        </h2>
        <p className="text-[#9DA9C6] max-w-xl mx-auto mb-10 text-sm sm:text-base leading-relaxed">
          Join thousands of buyers and suppliers using Reversely for transparent, competitive commerce.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            variant="primary"
            onClick={() => navigate('/customer/requirements/new')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Post a Requirement
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/login')}
          >
            Try Demo Account
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default HowItWorksPage;
