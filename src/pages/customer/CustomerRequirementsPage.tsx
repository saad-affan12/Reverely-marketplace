import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRequirementStore } from '../../stores/useRequirementStore';
import { Card, Button, StatusBadge, Input, Select, EmptyState } from '../../components/ui';
import { Plus, Eye, MessageSquare, Calendar, MapPin } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { PageHero } from '../../components/layout/PageHero';

export const CustomerRequirementsPage: React.FC = () => {
  const requirements = useRequirementStore((state) => state.requirements);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = requirements.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Open', value: 'open' },
    { label: 'Closed', value: 'closed' },
    { label: 'Fulfilled', value: 'fulfilled' },
  ];

  return (
    <PageContainer>
      <PageHero
        eyebrow="Buyer Requirements Feed"
        title="My Posted"
        titleHighlight="Requirements"
        description="Track live supplier bids, compare quotes, and manage fulfillment requests"
        bgText="REQUIREMENTS"
        action={
          <Link to="/customer/requirements/new">
            <Button size="lg" variant="primary" leftIcon={<Plus className="w-5 h-5" />}>
              Post New Requirement
            </Button>
          </Link>
        }
      />

      <Card variant="elevated" className="mb-8 p-5">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search requirements by keyword or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full md:w-56">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <EmptyState
            title="No requirements found"
            description="No requirements match your current search or status filter."
            actionText="Post New Requirement"
            onAction={() => window.location.href = '/customer/requirements/new'}
          />
        ) : (
          filtered.map((req) => (
            <Card key={req.id} variant="interactive" className="space-y-3 p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono-tech font-bold text-[#6B8CFF] bg-[#5B37F5]/15 px-2.5 py-1 rounded-md border border-[#5B37F5]/30">{req.id}</span>
                    <StatusBadge status={req.status} size="sm" />
                    <span className="text-xs text-[#9DA9C6] font-mono-tech">{req.category}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#F5F7FF]">{req.title}</h3>
                  <div className="flex flex-wrap gap-4 text-xs font-mono-tech text-[#9DA9C6]">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#6F7D9C]" /> {req.location}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#6F7D9C]" /> {req.deadline}</span>
                    <span className="font-bold text-[#2BD696]">Budget: ₹{req.minBudget.toLocaleString('en-IN')} - ₹{req.maxBudget.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t md:border-t-0 border-white/8 pt-4 md:pt-0">
                  <div className="text-right mr-2 hidden md:block">
                    <div className="text-sm font-bold text-[#F5F7FF] font-mono-tech flex items-center justify-end gap-1">
                      <MessageSquare className="w-4 h-4 text-[#6B8CFF]" /> {req.offersCount} Offers
                    </div>
                    <span className="text-xs text-[#6F7D9C] font-mono-tech">Received</span>
                  </div>
                  <Link to={`/customer/requirements/${req.id}`}>
                    <Button variant="outline" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
                      View Details
                    </Button>
                  </Link>
                  <Link to={`/customer/requirements/${req.id}/compare`}>
                    <Button size="sm" variant="primary">Compare Offers</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </PageContainer>
  );
};

export default CustomerRequirementsPage;
