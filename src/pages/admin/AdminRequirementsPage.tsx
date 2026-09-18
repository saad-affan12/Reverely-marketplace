import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tag, ExternalLink, FileText, CheckCircle2, Clock, XCircle, MessageSquare } from 'lucide-react';
import { useRequirementStore } from '../../stores/useRequirementStore';
import { Requirement, RequirementStatus } from '../../types';
import { Button, Badge, Toast } from '../../components/ui';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminDataTable, Column } from '../../components/admin/AdminDataTable';

export const AdminRequirementsPage: React.FC = () => {
  const { requirements, updateRequirementStatus } = useRequirementStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleStatusChange = (id: string, newStatus: RequirementStatus) => {
    updateRequirementStatus(id, newStatus);
    setToastMessage(`Requirement ${id} status updated to ${newStatus.toUpperCase()}`);
  };

  const categories = Array.from(new Set(requirements.map((r) => r.category)));

  const filteredReqs = requirements.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || r.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusVariant = (status: RequirementStatus) => {
    switch (status) {
      case 'open':
        return 'success';
      case 'fulfilled':
        return 'info';
      case 'closed':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  const totalReqs = requirements.length;
  const openCount = requirements.filter((r) => r.status === 'open').length;
  const fulfilledCount = requirements.filter((r) => r.status === 'fulfilled').length;
  const closedCount = requirements.filter((r) => r.status === 'closed').length;
  const totalQuotes = requirements.reduce((acc, r) => acc + r.offersCount, 0);

  const columns: Column<Requirement>[] = [
    {
      header: 'Req ID',
      accessorKey: 'id',
      cell: (req) => (
        <span className="font-mono text-xs font-bold text-indigo-400">{req.id}</span>
      ),
    },
    {
      header: 'Title & Category',
      accessorKey: 'title',
      cell: (req) => (
        <div className="max-w-xs space-y-1">
          <p className="font-sans font-bold text-white truncate">{req.title}</p>
          <p className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono-tech">
            <Tag className="w-3 h-3 text-indigo-400" /> {req.category} • {req.quantity} {req.unit}
          </p>
        </div>
      ),
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
      cell: (req) => <span className="text-slate-300 font-medium">{req.customerName}</span>,
    },
    {
      header: 'Budget Max',
      accessorKey: 'maxBudget',
      cell: (req) => (
        <span className="font-bold text-white font-mono-tech">
          {formatCurrency(req.maxBudget)}
        </span>
      ),
    },
    {
      header: 'Quotes Received',
      accessorKey: 'offersCount',
      cell: (req) => (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold font-mono-tech bg-indigo-950/80 text-indigo-300 border border-indigo-800/50">
          <MessageSquare className="w-3.5 h-3.5 text-indigo-400" /> {req.offersCount} Quotes
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (req) => (
        <Badge variant={getStatusVariant(req.status)}>
          {req.status.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Moderation Actions',
      cell: (req) => (
        <div className="flex items-center justify-end gap-2">
          <Link to={`/customer/requirements/${req.id}`}>
            <Button size="sm" variant="outline" className="border-slate-800 text-slate-300 hover:bg-slate-900 text-xs">
              View <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </Link>
          {req.status === 'open' && (
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleStatusChange(req.id, 'closed')}
              className="text-xs"
            >
              Close
            </Button>
          )}
          {req.status === 'closed' && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleStatusChange(req.id, 'open')}
              className="text-xs"
            >
              Re-open
            </Button>
          )}
        </div>
      ),
      className: 'text-right',
    },
  ];

  return (
    <AdminLayout
      watermark="REQUIREMENTS"
      eyebrow="MARKETPLACE DEMAND STREAM"
      title="Requirement Moderation"
      description="Monitor and moderate all customer-posted reverse marketplace requirements."
      metrics={
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono-tech pt-2">
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800/50">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Total Reqs</p>
              <p className="text-base font-bold text-white">{totalReqs}</p>
            </div>
          </div>
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/50">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Open Active</p>
              <p className="text-base font-bold text-white">{openCount}</p>
            </div>
          </div>
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-950 text-purple-400 border border-purple-800/50">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Total Quotes</p>
              <p className="text-base font-bold text-white">{totalQuotes}</p>
            </div>
          </div>
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-950 text-blue-400 border border-blue-800/50">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Fulfilled</p>
              <p className="text-base font-bold text-white">{fulfilledCount}</p>
            </div>
          </div>
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-950 text-amber-400 border border-amber-800/50">
              <XCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Closed</p>
              <p className="text-base font-bold text-white">{closedCount}</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {toastMessage && (
          <Toast
            id="admin-reqs-toast"
            message={toastMessage}
            type="info"
            onClose={() => setToastMessage(null)}
          />
        )}

        <AdminDataTable
          data={filteredReqs}
          columns={columns}
          keyExtractor={(r) => r.id}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search requirement by title, ID or customer..."
          filters={[
            {
              id: 'status',
              label: 'Status',
              value: statusFilter,
              options: [
                { value: 'all', label: 'All Statuses' },
                { value: 'open', label: 'Open' },
                { value: 'fulfilled', label: 'Fulfilled' },
                { value: 'closed', label: 'Closed' },
                { value: 'cancelled', label: 'Cancelled' },
              ],
              onChange: setStatusFilter,
            },
            {
              id: 'category',
              label: 'Category',
              value: categoryFilter,
              options: [
                { value: 'all', label: 'All Categories' },
                ...categories.map((c) => ({ value: c, label: c })),
              ],
              onChange: setCategoryFilter,
            },
          ]}
        />
      </div>
    </AdminLayout>
  );
};
