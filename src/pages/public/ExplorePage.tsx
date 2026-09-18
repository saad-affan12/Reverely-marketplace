import React, { useState } from 'react';
import { Search, Layers, ShoppingBag, Sparkles } from 'lucide-react';
import { useRequirementStore } from '../../stores/useRequirementStore';
import { useProductStore } from '../../stores/useProductStore';
import { RequirementCard } from '../../components/shared/RequirementCard';
import { ProductCard } from '../../components/shared/ProductCard';
import { Input, Select, EmptyState } from '../../components/ui';
import { PageContainer } from '../../components/layout/PageContainer';
import { PageHero } from '../../components/layout/PageHero';

export const ExplorePage: React.FC = () => {
  const { requirements } = useRequirementStore();
  const { products } = useProductStore();

  const [activeTab, setActiveTab] = useState<'requirements' | 'products'>('requirements');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { label: 'All Categories', value: 'all' },
    { label: 'Apparel & Textiles', value: 'Apparel & Textiles' },
    { label: 'Furniture & Decor', value: 'Furniture & Decor' },
    { label: 'Media & Events', value: 'Media & Events' },
    { label: 'Electronics & IT', value: 'Electronics & IT' },
    { label: 'Corporate Gifts', value: 'Corporate Gifts' },
    { label: 'Food & Catering', value: 'Food & Catering' },
  ];

  const filteredRequirements = requirements.filter((req) => {
    const matchesSearch =
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || req.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      prod.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || prod.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <PageContainer>
      {/* Hero Header */}
      <PageHero
        eyebrow="Live Reverse Marketplace Feed"
        title="Explore"
        titleHighlight="Marketplace"
        description="Browse active customer requirements seeking competitive vendor quotes or discover verified direct catalog products across India."
        bgText="MARKETPLACE"
      />

      {/* Interactive Controls Card */}
      <div className="bg-[#0F1428]/90 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl space-y-6 mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/8 pb-5">
          {/* Tab Switches */}
          <div className="flex bg-[#0B1020] p-1.5 rounded-2xl w-full sm:w-auto border border-white/10 font-mono-tech">
            <button
              type="button"
              onClick={() => setActiveTab('requirements')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'requirements'
                  ? 'bg-[#5B37F5] text-white shadow-lg shadow-[#5B37F5]/30'
                  : 'text-[#9DA9C6] hover:text-[#F5F7FF]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Requirements ({filteredRequirements.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#5B37F5] text-white shadow-lg shadow-[#5B37F5]/30'
                  : 'text-[#9DA9C6] hover:text-[#F5F7FF]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Catalog Products ({filteredProducts.length})</span>
            </button>
          </div>

          <div className="text-xs text-[#9DA9C6] font-mono-tech bg-[#0B1020] px-4 py-2 rounded-xl border border-white/10">
            Active items: <span className="text-[#6B8CFF] font-bold">{activeTab === 'requirements' ? filteredRequirements.length : filteredProducts.length}</span>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Input
              placeholder={`Search ${activeTab === 'requirements' ? 'requirements by title, location, or details...' : 'catalog products...'}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div>
            <Select
              options={categories}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid Results */}
      <div>
        {activeTab === 'requirements' ? (
          filteredRequirements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequirements.map((req) => (
                <RequirementCard key={req.id} requirement={req} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No requirements found"
              description="Try changing your search keywords or category filter."
            />
          )
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No products found"
            description="Try changing your search keywords or category filter."
          />
        )}
      </div>
    </PageContainer>
  );
};

export default ExplorePage;
