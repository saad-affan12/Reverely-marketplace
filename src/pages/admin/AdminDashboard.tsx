import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Store,
  FileText,
  Tag,
  ShoppingBag,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  ExternalLink,
  MessageSquare,
  DollarSign,
} from 'lucide-react';
import { useRequirementStore } from '../../stores/useRequirementStore';
import { useOfferStore } from '../../stores/useOfferStore';
import { useOrderStore } from '../../stores/useOrderStore';
import { useProductStore } from '../../stores/useProductStore';
import { mockUsers } from '../../mock/seedData';
import { StatCard, Badge, Button } from '../../components/ui';
import { FadeIn, SlideUp, AnimatedCounter } from '../../components/motion/MotionPrimitives';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminDataTable, Column } from '../../components/admin/AdminDataTable';
import { AdminOrderAuditModal } from '../../components/admin/AdminOrderAuditModal';
import { Order } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { requirements } = useRequirementStore();
  const { offers } = useOfferStore();
  const { orders } = useOrderStore();
  const { products } = useProductStore();

  const [selectedAuditOrder, setSelectedAuditOrder] = useState<Order | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  const customersCount = mockUsers.filter((u) => u.role === 'customer').length;
  const vendorsCount = mockUsers.filter((u) => u.role === 'vendor').length;

  const totalGMV = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const openReqsCount = requirements.filter((r) => r.status === 'open').length;
  const fulfilledReqsCount = requirements.filter((r) => r.status === 'fulfilled').length;
  const acceptedOffersCount = offers.filter((o) => o.status === 'accepted').length;

  const activeOrdersCount = orders.filter((o) => o.status !== 'delivered').length;
  const completedOrdersCount = orders.filter((o) => o.status === 'delivered').length;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getOrderStatusVariant = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
      case 'packed':
        return 'info';
      case 'processing':
      case 'confirmed':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.title.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.vendorName.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const orderColumns: Column<Order>[] = [
    {
      header: 'Order ID',
      accessorKey: 'id',
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-indigo-400">{row.id}</span>
      ),
    },
    {
      header: 'Requirement / Item',
      accessorKey: 'title',
      cell: (row) => (
        <div className="max-w-[200px] truncate">
          <p className="font-sans font-bold text-white truncate">{row.title}</p>
          <span className="text-[10px] text-slate-500 font-mono-tech">
            Est: {row.expectedDelivery}
          </span>
        </div>
      ),
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
      cell: (row) => <span className="text-slate-300">{row.customerName}</span>,
    },
    {
      header: 'Vendor',
      accessorKey: 'vendorName',
      cell: (row) => <span className="text-slate-300">{row.vendorName}</span>,
    },
    {
      header: 'Amount',
      accessorKey: 'totalAmount',
      cell: (row) => (
        <span className="font-bold text-white font-mono-tech">
          {formatCurrency(row.totalAmount)}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <Badge variant={getOrderStatusVariant(row.status)}>
          {row.status.replace('_', ' ').toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Action',
      cell: (row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setSelectedAuditOrder(row);
            setIsAuditModalOpen(true);
          }}
          className="border-slate-800 text-slate-300 hover:bg-slate-900 text-xs"
        >
          Track & Audit
        </Button>
      ),
      className: 'text-right',
    },
  ];

  return (
    <AdminLayout
      watermark="CONTROL"
      eyebrow="REVERSELY PLATFORM CONTROL CENTER"
      title="Control Center"
      description="Real-time multi-vendor metrics, reverse marketplace liquidity, quotation engine activity, and order fulfillment status across India."
      actions={
        <>
          <Link to="/admin/users">
            <Button variant="outline" size="sm" className="border-slate-800 text-slate-300 hover:bg-slate-900">
              <Users className="w-4 h-4 mr-1.5" /> Manage Users
            </Button>
          </Link>
          <Link to="/admin/requirements">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 shadow-lg shadow-indigo-600/30">
              <FileText className="w-4 h-4 mr-1.5" /> Moderate Req's
            </Button>
          </Link>
        </>
      }
    >
      <div className="space-y-8">
        {/* KPI Summary Cards */}
        <FadeIn delay={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Platform GMV"
            value={formatCurrency(totalGMV)}
            change="+18.4% liquidity growth"
            isPositive={true}
            icon={<TrendingUp className="w-6 h-6 text-indigo-400" />}
          />
          <StatCard
            title="Active Customers"
            value={customersCount.toString()}
            change="+12 new buyers"
            isPositive={true}
            icon={<Users className="w-6 h-6 text-blue-400" />}
          />
          <StatCard
            title="Verified Vendors"
            value={vendorsCount.toString()}
            change="100% platform trust score"
            isPositive={true}
            icon={<Store className="w-6 h-6 text-emerald-400" />}
          />
          <StatCard
            title="Total Orders"
            value={orders.length.toString()}
            change={`${completedOrdersCount} completed`}
            isPositive={true}
            icon={<ShoppingBag className="w-6 h-6 text-amber-400" />}
          />
        </FadeIn>

        {/* Secondary Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono-tech">
          <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
            <p className="text-xs text-slate-400">Requirements</p>
            <p className="text-xl font-bold text-white mt-1">{requirements.length}</p>
            <span className="text-[10px] text-emerald-400 font-bold">{openReqsCount} Open</span>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
            <p className="text-xs text-slate-400">Submitted Quotes</p>
            <p className="text-xl font-bold text-white mt-1">{offers.length}</p>
            <span className="text-[10px] text-indigo-400 font-bold">{acceptedOffersCount} Accepted</span>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
            <p className="text-xs text-slate-400">Catalog Products</p>
            <p className="text-xl font-bold text-white mt-1">{products.length}</p>
            <span className="text-[10px] text-slate-400">Direct Store</span>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
            <p className="text-xs text-slate-400">Active Deliveries</p>
            <p className="text-xl font-bold text-white mt-1">{activeOrdersCount}</p>
            <span className="text-[10px] text-amber-400 font-bold">In Transit</span>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
            <p className="text-xs text-slate-400">Fulfilled Req's</p>
            <p className="text-xl font-bold text-white mt-1">{fulfilledReqsCount}</p>
            <span className="text-[10px] text-emerald-400 font-bold">Closed Deals</span>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
            <p className="text-xs text-slate-400">Liquidity Index</p>
            <p className="text-xl font-bold text-white mt-1">
              {requirements.length ? (offers.length / requirements.length).toFixed(1) : 0}
            </p>
            <span className="text-[10px] text-indigo-400 font-bold">Quotes / Req</span>
          </div>
        </div>

        {/* Main Orders & Live Stream Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders Log (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-400" /> Platform Orders Log
              </h2>
              <Link
                to="/admin/orders"
                className="text-xs font-mono-tech font-bold text-indigo-400 hover:underline flex items-center gap-1"
              >
                View All Orders <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <AdminDataTable
              data={filteredOrders.slice(0, 5)}
              columns={orderColumns}
              keyExtractor={(o) => o.id}
              searchQuery={orderSearch}
              onSearchChange={setOrderSearch}
              searchPlaceholder="Filter recent orders..."
              filters={[
                {
                  id: 'status',
                  label: 'Status',
                  value: orderStatusFilter,
                  options: [
                    { value: 'all', label: 'All Statuses' },
                    { value: 'confirmed', label: 'Confirmed' },
                    { value: 'processing', label: 'Processing' },
                    { value: 'shipped', label: 'Shipped' },
                    { value: 'delivered', label: 'Delivered' },
                  ],
                  onChange: setOrderStatusFilter,
                },
              ]}
            />
          </div>

          {/* Live Marketplace Activity Stream (1 col) */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" /> Platform Activity Stream
            </h2>

            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="space-y-4">
                {requirements.slice(0, 4).map((req) => (
                  <div
                    key={req.id}
                    className="flex items-start gap-3 text-xs font-mono-tech border-b border-slate-800/80 pb-3.5 last:border-0 last:pb-0"
                  >
                    <div className="p-2 rounded-xl bg-indigo-950/80 text-indigo-400 border border-indigo-800/50 mt-0.5 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white font-sans truncate max-w-[150px]">
                          {req.title}
                        </span>
                        <span className="text-[10px] text-slate-500">{req.id}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] flex items-center gap-1.5">
                        <span>{req.customerName}</span> •{' '}
                        <span className="text-indigo-400 font-bold">{formatCurrency(req.maxBudget)}</span>
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <Badge variant="info" size="sm">
                          {req.offersCount} Quotes Received
                        </Badge>
                        <span className="text-[10px] text-slate-500">{req.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-800 text-center">
                <Link
                  to="/admin/requirements"
                  className="text-xs font-mono-tech font-bold text-indigo-400 hover:underline inline-flex items-center gap-1"
                >
                  View All Requirements Stream <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Modal */}
      <AdminOrderAuditModal
        order={selectedAuditOrder}
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />
    </AdminLayout>
  );
};
