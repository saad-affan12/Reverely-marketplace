import React from 'react';
import { ArrowRight, Shield, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card } from '../../components/ui';
import { PageContainer } from '../../components/layout/PageContainer';
import { PageHero } from '../../components/layout/PageHero';

export const AboutPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHero
        eyebrow="Our Vision & Mission"
        title="Reinventing How"
        titleHighlight="Procurement Happens"
        description="Reversely flips traditional e-commerce on its head. Instead of buyers hunting through thousands of fixed product pages, customers state their exact requirements and let verified vendors present competitive bids."
        bgText="CONTROL"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <Card variant="elevated" className="text-center space-y-4">
          <Zap className="w-8 h-8 text-[#6B8CFF] mx-auto" />
          <h3 className="font-bold text-lg text-[#F5F7FF]">Competitive Bidding</h3>
          <p className="text-xs text-[#9DA9C6] leading-relaxed">
            Multiple vendors submit tailored quotes to get you the best market value without manual negotiation friction.
          </p>
        </Card>

        <Card variant="elevated" className="text-center space-y-4">
          <Shield className="w-8 h-8 text-[#2BD696] mx-auto" />
          <h3 className="font-bold text-lg text-[#F5F7FF]">Verified Vendors</h3>
          <p className="text-xs text-[#9DA9C6] leading-relaxed">
            Every supplier is vetted for business trust, fulfillment history, escrow safety, and quality standards.
          </p>
        </Card>

        <Card variant="elevated" className="text-center space-y-4">
          <Users className="w-8 h-8 text-[#FAB505] mx-auto" />
          <h3 className="font-bold text-lg text-[#F5F7FF]">Transparent Comparison</h3>
          <p className="text-xs text-[#9DA9C6] leading-relaxed">
            Side-by-side decision matrices comparing price, warranty, delivery times, and trust score metrics.
          </p>
        </Card>
      </div>

      <div className="bg-gradient-to-r from-[#131A32] to-[#0F1428] border border-white/10 text-white rounded-3xl p-10 sm:p-14 text-center space-y-6 shadow-2xl">
        <h2 className="text-3xl font-extrabold tracking-tight text-[#F5F7FF]">Ready to Experience Reverse Procurement?</h2>
        <p className="text-[#9DA9C6] text-sm max-w-xl mx-auto leading-relaxed">
          Post your requirement today and receive verified vendor quotes within hours.
        </p>
        <Link to="/customer/requirements/new" className="inline-block">
          <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Post a Requirement
          </Button>
        </Link>
      </div>
    </PageContainer>
  );
};

export default AboutPage;
