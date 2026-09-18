import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  Sparkles,
  ArrowRight,
  Clock,
  Star,
  Quote,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useRequirementStore } from '../../stores/useRequirementStore';
import { RequirementCard } from '../../components/shared/RequirementCard';
import { Button, Card, Badge } from '../../components/ui';
import { EditorialBackgroundText } from '../../components/layout/EditorialBackgroundText';
import { PageContainer } from '../../components/layout/PageContainer';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { requirements } = useRequirementStore();
  const [quickInput, setQuickInput] = useState('');

  const featuredRequirements = requirements.slice(0, 3);

  const handleQuickPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickInput.trim()) {
      navigate('/customer/requirements/new', {
        state: { initialTitle: quickInput },
      });
    } else {
      navigate('/customer/requirements/new');
    }
  };

  const sampleSuggestions = [
    '100 Customized T-Shirts for event',
    'Office Ergonomic Chairs Setup',
    'Corporate Gift Boxes (50 units)',
  ];

  return (
    <div className="bg-[#050816] text-[#F5F7FF] min-h-screen font-sans selection:bg-[#5B37F5] selection:text-white overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-28 px-4 sm:px-6 lg:px-8 bg-radial-gradient bg-grid-pattern border-b border-white/8">
        <EditorialBackgroundText text="REVERSELY" />

        <div className="max-w-[1440px] mx-auto relative z-10 text-center">
          {/* Top Tag Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5B37F5]/15 border border-[#5B37F5]/30 text-[#6B8CFF] text-xs font-mono-tech uppercase tracking-widest mb-8 shadow-md backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#48CBFF]" />
            <span>Reverse Multi-Vendor Marketplace Protocol</span>
          </div>

          {/* Staggered Editorial Hero Headline */}
          <div className="max-w-4xl mx-auto mb-8 relative">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] text-[#F5F7FF] uppercase font-sans">
              <span className="block font-serif-editorial italic font-normal text-gradient-indigo text-6xl sm:text-8xl lg:text-9xl tracking-normal normal-case">
                Don't search.
              </span>
              <span className="block text-gradient-silver mt-2">
                Let vendors come to you.
              </span>
            </h1>
          </div>

          <p className="text-lg sm:text-xl text-[#9DA9C6] max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Post exactly what you need and receive competitive offers from verified vendors. Compare prices, delivery times, and trust ratings to pick the best proposal.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/customer/requirements/new')}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Post a Requirement
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/explore')}
            >
              Explore Marketplace
            </Button>
          </div>

          {/* INTERACTIVE REQUIREMENT INPUT CARD */}
          <div className="max-w-2xl mx-auto relative z-20">
            <div className="bg-[#0F1428]/90 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-white/12 shadow-2xl transition-all focus-within:border-[#5B37F5] focus-within:ring-2 focus-within:ring-[#5B37F5]/30">
              <form onSubmit={handleQuickPost} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  placeholder="What are you looking for? (e.g. 100 Custom T-Shirts for event)"
                  className="flex-1 bg-[#131A32] text-[#F5F7FF] placeholder:text-[#6F7D9C] px-4 py-3.5 rounded-xl border border-white/10 focus:border-[#5B37F5] focus:outline-none text-sm font-medium"
                />
                <Button
                  type="submit"
                  variant="success"
                  size="md"
                  leftIcon={<Send className="w-4 h-4" />}
                >
                  Post Requirement
                </Button>
              </form>

              {/* Suggestions chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs font-mono-tech">
                <span className="text-[#6F7D9C]">Try:</span>
                {sampleSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setQuickInput(suggestion)}
                    className="px-3 py-1 rounded-full bg-[#131A32] hover:bg-[#18203A] text-[#9DA9C6] hover:text-[#F5F7FF] border border-white/8 transition-colors text-[11px] cursor-pointer"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ANIMATED STATS SECTION */}
      <section className="bg-[#0B1020] border-b border-white/8 py-12 relative z-10 font-mono-tech">
        <PageContainer className="py-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl sm:text-5xl font-extrabold text-[#F5F7FF]">10,000+</p>
              <p className="text-xs sm:text-sm font-medium text-[#9DA9C6] mt-1 uppercase">Active Customers</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-extrabold text-[#6B8CFF]">2,000+</p>
              <p className="text-xs sm:text-sm font-medium text-[#9DA9C6] mt-1 uppercase">Verified Vendors</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-extrabold text-[#2BD696]">25,000+</p>
              <p className="text-xs sm:text-sm font-medium text-[#9DA9C6] mt-1 uppercase">Products & Services</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-extrabold text-[#FAB505]">98.5%</p>
              <p className="text-xs sm:text-sm font-medium text-[#9DA9C6] mt-1 uppercase">Fulfillment Rate</p>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* SECTION: THE PROBLEM */}
      <section className="py-24 relative border-b border-white/8">
        <EditorialBackgroundText text="PROBLEM" />

        <PageContainer className="relative z-10 text-center">
          <Badge variant="primary" size="md" className="mb-4">
            The Marketplace Paradigm
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F5F7FF] leading-tight">
            Traditional marketplaces force you to search endlessly.
          </h2>
          <p className="text-2xl sm:text-4xl font-serif-editorial italic text-gradient-indigo mt-6 max-w-3xl mx-auto leading-snug">
            "Stop searching through hundreds of products. Start receiving custom offers."
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 text-left">
            <Card variant="danger" className="space-y-3">
              <span className="text-xs font-mono-tech text-[#FF5677] uppercase tracking-wider block font-bold">Traditional Marketplace</span>
              <h3 className="text-xl font-bold text-[#F5F7FF]">Search & Negotiate Manually</h3>
              <p className="text-xs text-[#9DA9C6] leading-relaxed">
                Filter endlessly, call multiple suppliers individually, deal with hidden pricing, and hope the product meets your exact specifications.
              </p>
            </Card>

            <Card variant="success" className="space-y-3">
              <span className="text-xs font-mono-tech text-[#2BD696] uppercase tracking-wider block font-bold">The Reversely Way</span>
              <h3 className="text-xl font-bold text-[#F5F7FF]">Post Once, Receive Offers</h3>
              <p className="text-xs text-[#9DA9C6] leading-relaxed">
                State your exact quantity, budget ceiling, and required delivery date. Verified suppliers compete directly for your order.
              </p>
            </Card>
          </div>
        </PageContainer>
      </section>

      {/* HOW IT WORKS - 4-STEP CARDS */}
      <section className="py-24 relative border-b border-white/8">
        <EditorialBackgroundText text="STEPS" />

        <PageContainer className="relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="primary" size="md" className="mb-3">
              Reverse Marketplace Workflow
            </Badge>
            <h2 className="text-3xl font-extrabold text-[#F5F7FF] sm:text-5xl tracking-tight">
              How It Works in 4 Steps
            </h2>
            <p className="text-[#9DA9C6] mt-2 text-base">
              From requirement posting to doorstep delivery fulfillment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card variant="interactive" className="space-y-3">
              <span className="text-5xl font-serif-editorial italic text-[#6B8CFF] font-bold block">01</span>
              <h3 className="text-xl font-bold text-[#F5F7FF]">POST</h3>
              <p className="text-xs text-[#9DA9C6] leading-relaxed">
                Tell vendors exactly what you need, your target quantity, budget ceiling, & delivery timeline.
              </p>
            </Card>

            <Card variant="interactive" className="space-y-3">
              <span className="text-5xl font-serif-editorial italic text-[#6B8CFF] font-bold block">02</span>
              <h3 className="text-xl font-bold text-[#F5F7FF]">COMPETE</h3>
              <p className="text-xs text-[#9DA9C6] leading-relaxed">
                Relevant verified vendors discover your requirement and submit custom price quotes & terms.
              </p>
            </Card>

            <Card variant="interactive" className="space-y-3">
              <span className="text-5xl font-serif-editorial italic text-[#6B8CFF] font-bold block">03</span>
              <h3 className="text-xl font-bold text-[#F5F7FF]">COMPARE</h3>
              <p className="text-xs text-[#9DA9C6] leading-relaxed">
                Compare price, delivery speed, trust score, & warranties side-by-side in real-time.
              </p>
            </Card>

            <Card variant="interactive" className="space-y-3">
              <span className="text-5xl font-serif-editorial italic text-[#2BD696] font-bold block">04</span>
              <h3 className="text-xl font-bold text-[#F5F7FF]">CHOOSE</h3>
              <p className="text-xs text-[#9DA9C6] leading-relaxed">
                Accept the offer that works best for you with 1-click escrow protection.
              </p>
            </Card>
          </div>
        </PageContainer>
      </section>

      {/* LIVE MARKETPLACE REQUIREMENTS FEED */}
      <section className="py-24 border-b border-white/8">
        <PageContainer>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <Badge variant="info" size="md" className="mb-3">
                Live Feed
              </Badge>
              <h2 className="text-3xl font-extrabold text-[#F5F7FF] sm:text-4xl">
                Active Marketplace Requirements
              </h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/explore')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              View All Requirements
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredRequirements.map((req) => (
              <RequirementCard key={req.id} requirement={req} />
            ))}
          </div>
        </PageContainer>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-24 relative border-b border-white/8">
        <EditorialBackgroundText text="VOICES" />

        <PageContainer className="relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="primary" size="md" className="mb-3">
              Marketplace Testimonials
            </Badge>
            <h2 className="text-3xl font-extrabold text-[#F5F7FF] sm:text-5xl tracking-tight">
              Trusted by Buyers & Vendors
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card variant="elevated" className="space-y-4">
              <Quote className="w-8 h-8 text-[#6B8CFF] opacity-60" />
              <p className="text-base text-[#F5F7FF] leading-relaxed font-serif-editorial italic">
                "Instead of contacting five suppliers individually, I posted one requirement and received multiple quotations within hours. Saved us 20% on our corporate swag order."
              </p>
              <div className="pt-4 border-t border-white/8">
                <p className="text-sm font-bold text-[#F5F7FF]">Ananya Sharma</p>
                <p className="text-xs text-[#9DA9C6]">Event Lead, TechCorp India</p>
              </div>
            </Card>

            <Card variant="elevated" className="space-y-4">
              <Quote className="w-8 h-8 text-[#2BD696] opacity-60" />
              <p className="text-base text-[#F5F7FF] leading-relaxed font-serif-editorial italic">
                "Reversely gives our manufacturing business access to high-intent bulk orders without spending money on Google ads. We win deals by offering honest, direct quotes."
              </p>
              <div className="pt-4 border-t border-white/8">
                <p className="text-sm font-bold text-[#F5F7FF]">Rajesh Kumar</p>
                <p className="text-xs text-[#9DA9C6]">Founder, PrintHub Supplies</p>
              </div>
            </Card>
          </div>
        </PageContainer>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 text-center">
        <PageContainer>
          <h2 className="text-4xl sm:text-6xl font-extrabold text-[#F5F7FF] mb-4 tracking-tight">
            Have something specific in mind?
          </h2>
          <p className="text-lg text-[#9DA9C6] mb-10 max-w-xl mx-auto leading-relaxed">
            Post your requirement today and let verified vendors submit competitive offers directly to you.
          </p>
          <Button
            size="lg"
            variant="primary"
            onClick={() => navigate('/customer/requirements/new')}
          >
            Post a Requirement Now
          </Button>
        </PageContainer>
      </section>
    </div>
  );
};

export default LandingPage;
