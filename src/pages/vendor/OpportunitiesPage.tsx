import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Tag,
  MessageSquare,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Zap,
} from 'lucide-react';
import { useRequirementStore } from '../../stores/useRequirementStore';
import { Card, Badge, Button, EmptyState, Input, Select, StatusBadge } from '../../components/ui';
import { PageContainer, PageHero } from '../../components/layout';
import { FadeIn, SlideUp } from '../../components/motion/MotionPrimitives';

export const OpportunitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const { requirements } = useRequirementStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBudget, setSelectedBudget] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredRequirements = useMemo(() => {
    return requirements
      .filter((req) => {
        if (req.status !== 'open') return false;

        const matchesSearch =
          req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          req.location.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (selectedCategory !== 'all' && req.category !== selectedCategory) {
          return false;
        }

        if (selectedBudget === 'under10k' && req.maxBudget >= 10000) return false;
        if (
          selectedBudget === '10k-50k' &&
          (req.maxBudget < 10000 || req.maxBudget > 50000)
        )
          return false;
        if (selectedBudget === 'over50k' && req.maxBudget <= 50000) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'highestBudget') {
          return b.maxBudget - a.maxBudget;
        }
        if (sortBy === 'lowestOffers') {
          return a.offersCount - b.offersCount;
        }
        return 0;
      });
  }, [requirements, searchQuery, selectedCategory, selectedBudget, sortBy]);

  const getMatchScore = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const score = 85 + (Math.abs(hash) % 14);
    return score;
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Apparel & Merch', label: 'Apparel & Merch' },
    { value: 'Furniture & Decor', label: 'Furniture & Decor' },
    { value: 'Electronics & Tech', label: 'Electronics & Tech' },
    { value: 'Photography & Video', label: 'Photography & Video' },
    { value: 'Events & Catering', label: 'Events & Catering' },
    { value: 'Printing & Packaging', label: 'Printing & Packaging' },
  ];

  return (
    <PageContainer bgText="OPPORTUNITIES">
      <div className="space-y-8">
        <PageHero
          eyebrow="VENDOR OPPORTUNITY MARKETPLACE"
          title="Find New Opportunities"
          titleHighlight="& Submit Quotes"
          description="Browse active buyer requirements, submit competitive quotes, and win orders directly through verified escrow settlements."
          bgText="OPPORTUNITIES"
          stats={
            <div className="flex flex-wrap gap-4 text-xs font-mono-tech text-slate-300 pt-2">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>
                  <strong className="text-white">{filteredRequirements.length}</strong> Open Opportunities
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>
                  <strong className="text-white">Direct Escrow</strong> Order Conversion
                </span>
              </div>
            </div>
          }
        />

        {/* Filter & Search Bar */}
        <FadeIn delay={0.1} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search requirement, title, location, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>

            <div>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                options={categories}
              />
            </div>

            <div>
              <Select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                options={[
                  { value: 'all', label: 'All Budgets' },
                  { value: 'under10k', label: 'Under ₹10,000' },
                  { value: '10k-50k', label: '₹10,000 - ₹50,000' },
                  { value: 'over50k', label: 'Above ₹50,000' },
                ]}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-800/80 text-xs font-mono-tech text-slate-400 gap-2">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-indigo-400" />
              <span>Showing {filteredRequirements.length} opportunity results</span>
            </div>

            <div className="flex items-center gap-2">
              <span>Sort by:</span>
              <select
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 text-xs focus:outline-none cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="highestBudget">Highest Customer Budget</option>
                <option value="lowestOffers">Lowest Competition</option>
              </select>
            </div>
          </div>
        </FadeIn>

        {/* Opportunity Grid */}
        {filteredRequirements.length === 0 ? (
          <div className="glass-card p-12 text-center text-slate-400 rounded-3xl border border-slate-800">
            <EmptyState
              title="No matching opportunities found"
              description="Try adjusting your search keywords, category filters, or budget range to discover new open requests."
              actionText="Reset All Filters"
              onAction={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedBudget('all');
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequirements.map((req) => {
              const matchScore = getMatchScore(req.id);
              return (
                <Card
                  key={req.id}
                  variant="interactive"
                  className="p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono-tech font-semibold text-indigo-400 bg-indigo-950/80 border border-indigo-800/50 px-3 py-1 rounded-full uppercase tracking-wider">
                        {req.category}
                      </span>
                      <div className="inline-flex items-center gap-1 bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 px-2.5 py-1 rounded-full text-xs font-mono-tech font-bold">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        <span>{matchScore}% Match</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white transition-colors line-clamp-1">
                        {req.title}
                      </h3>
                      <p className="text-xs font-mono-tech text-slate-400 mt-1">
                        Posted by <span className="font-medium text-slate-200">{req.customerName}</span>
                      </p>
                      <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                        {req.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono-tech bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Tag className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">Qty: <strong>{req.quantity} {req.unit}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{req.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300 col-span-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>Deadline: <strong className="text-slate-200">{req.deadline}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-800/80 pt-4 mt-4 space-y-3">
                    <div className="flex items-end justify-between font-mono-tech">
                      <div>
                        <span className="text-xs text-slate-400 block font-medium">Customer Budget</span>
                        <span className="text-lg font-extrabold text-indigo-400">
                          {formatCurrency(req.maxBudget)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 bg-slate-900 text-slate-400 px-2.5 py-1 rounded-lg border border-slate-800 text-xs">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{req.offersCount} quotes</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-center text-xs border-slate-800 text-slate-300 hover:bg-slate-900"
                        onClick={() => navigate(`/vendor/opportunities/${req.id}`)}
                      >
                        View Specs
                      </Button>

                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full justify-center text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                        onClick={() => navigate(`/vendor/opportunities/${req.id}/offer`)}
                      >
                        <span>Submit Quote</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default OpportunitiesPage;

