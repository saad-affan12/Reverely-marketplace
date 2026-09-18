import React, { useState } from 'react';
import { Tag, Store, Award, Clock, ShieldCheck, CheckCircle, XCircle } from 'lucide-react';
import { useOfferStore } from '../../stores/useOfferStore';
import { Offer, OfferStatus } from '../../types';
import { Badge } from '../../components/ui';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminDataTable, Column } from '../../components/admin/AdminDataTable';

export const AdminOffersPage: React.FC = () => {
  const { offers } = useOfferStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getOfferStatusVariant = (status: OfferStatus) => {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  const filteredOffers = offers.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.requirementId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalOffers = offers.length;
  const acceptedOffers = offers.filter((o) => o.status === 'accepted').length;
  const pendingOffers = offers.filter((o) => o.status === 'pending').length;

  const columns: Column<Offer>[] = [
    {
      header: 'Offer ID',
      accessorKey: 'id',
      cell: (offer) => (
        <span className="font-mono text-xs font-bold text-indigo-400">{offer.id}</span>
      ),
    },
    {
      header: 'Requirement Ref',
      accessorKey: 'requirementId',
      cell: (offer) => (
        <span className="font-mono text-xs font-bold text-slate-300">
          {offer.requirementId}
        </span>
      ),
    },
    {
      header: 'Vendor Supplier',
      accessorKey: 'vendorName',
      cell: (offer) => (
        <div className="space-y-0.5">
          <p className="font-bold font-sans text-white text-sm flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-emerald-400" /> {offer.vendorName}
          </p>
          <p className="text-[10px] text-indigo-400 font-mono-tech flex items-center gap-1">
            <Award className="w-3 h-3" /> Trust Score: {offer.vendorTrustScore}%
          </p>
        </div>
      ),
    },
    {
      header: 'Quoted Price',
      accessorKey: 'price',
      cell: (offer) => (
        <span className="font-bold text-white font-mono-tech text-sm">
          {formatCurrency(offer.price)}
        </span>
      ),
    },
    {
      header: 'Lead Time & Warranty',
      accessorKey: 'deliveryDays',
      cell: (offer) => (
        <div className="text-xs font-mono-tech text-slate-300 space-y-0.5">
          <p className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" /> {offer.deliveryDays} Days
          </p>
          <p className="text-[10px] text-slate-500">{offer.warranty}</p>
        </div>
      ),
    },
    {
      header: 'AI Match Score',
      accessorKey: 'matchScore',
      cell: (offer) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-mono-tech bg-indigo-950/80 text-indigo-300 border border-indigo-800/50">
          {offer.matchScore}% Match
        </span>
      ),
    },
    {
      header: 'Quotation Status',
      accessorKey: 'status',
      cell: (offer) => (
        <Badge variant={getOfferStatusVariant(offer.status)}>
          {offer.status.toUpperCase()}
        </Badge>
      ),
    },
  ];

  return (
    <AdminLayout
      watermark="OFFERS"
      eyebrow="VENDOR QUOTATION ENGINE"
      title="Submitted Quotations Audit"
      description="Audit all submitted vendor reverse-bids, price quotes, match scores, and delivery commitments across requirements."
      metrics={
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono-tech pt-2">
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800/50">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Total Quotes Submitted</p>
              <p className="text-base font-bold text-white">{totalOffers}</p>
            </div>
          </div>
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/50">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Accepted Deals</p>
              <p className="text-base font-bold text-white">{acceptedOffers}</p>
            </div>
          </div>
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-950 text-amber-400 border border-amber-800/50">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Pending Review</p>
              <p className="text-base font-bold text-white">{pendingOffers}</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <AdminDataTable
          data={filteredOffers}
          columns={columns}
          keyExtractor={(o) => o.id}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search offer ID, vendor or requirement ID..."
          filters={[
            {
              id: 'status',
              label: 'Status',
              value: statusFilter,
              options: [
                { value: 'all', label: 'All Statuses' },
                { value: 'pending', label: 'Pending' },
                { value: 'accepted', label: 'Accepted' },
                { value: 'rejected', label: 'Rejected' },
              ],
              onChange: setStatusFilter,
            },
          ]}
        />
      </div>
    </AdminLayout>
  );
};
