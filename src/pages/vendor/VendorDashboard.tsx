import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Tag,
  Package,
  Award,
  DollarSign,
  ArrowRight,
  MapPin,
  Clock,
  Zap,
  CheckCircle,
  Eye,
} from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useRequirementStore } from '../../stores/useRequirementStore';
import { useOfferStore } from '../../stores/useOfferStore';
import { useOrderStore } from '../../stores/useOrderStore';
import { StatCard, Card, StatusBadge, Button } from '../../components/ui';
import { PageContainer } from '../../components/layout/PageContainer';
import { PageHero } from '../../components/layout/PageHero';

export const VendorDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { requirements } = useRequirementStore();
  const { offers } = useOfferStore();
  const { orders } = useOrderStore();

  const currentVendorId = user?.id || 'user-vend-1';

  const openOpportunities = requirements.filter((r) => r.status === 'open');
  const myOffers = offers.filter(
    (o) => o.vendorId === currentVendorId || o.vendorName === (user?.companyName || 'PrintHub Express')
  );
  const acceptedOffers = myOffers.filter((o) => o.status === 'accepted');

  const myOrders = orders.filter(
    (o) => o.vendorId === currentVendorId || o.vendorName === (user?.companyName || 'PrintHub Express')
  );
  const activeOrders = myOrders.filter((o) => o.status !== 'delivered');
  const totalRevenue = myOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <PageContainer>
      {/* Page Hero Header */}
      <PageHero
        eyebrow="Verified Vendor Portal"
        title="Welcome back,"
        titleHighlight={user?.companyName || user?.name || 'PrintHub Express'}
        description="Explore live customer demands across India, submit competitive quotes, and manage your order fulfillment pipeline."
        bgText="VENDORS"
        action={
          <Link to="/vendor/opportunities">
            <Button size="lg" variant="success" leftIcon={<Zap className="w-5 h-5" />}>
              Find Opportunities
            </Button>
          </Link>
        }
      />

      {/* StatCards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          title="New Opportunities"
          value={openOpportunities.length}
          change="+4 today"
          isPositive={true}
          icon={<Zap className="w-5 h-5 text-[#FAB505]" />}
          subtitle="Customer demands"
        />
        <StatCard
          title="Submitted Bids"
          value={myOffers.length}
          icon={<Tag className="w-5 h-5 text-[#6B8CFF]" />}
          subtitle="Quotations sent"
        />
        <StatCard
          title="Accepted Offers"
          value={acceptedOffers.length}
          change="33% win rate"
          isPositive={true}
          icon={<CheckCircle className="w-5 h-5 text-[#2BD696]" />}
          subtitle="Converted to orders"
        />
        <StatCard
          title="Active Orders"
          value={activeOrders.length}
          icon={<Package className="w-5 h-5 text-[#6B8CFF]" />}
          subtitle="In fulfillment"
        />
        <StatCard
          title="Total Revenue"
          value={formatINR(totalRevenue > 0 ? totalRevenue : 145000)}
          change="+18%"
          isPositive={true}
          icon={<DollarSign className="w-5 h-5 text-[#2BD696]" />}
          subtitle="Gross sales"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Hot Opportunities Feed (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#F5F7FF] flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#FAB505]" /> Matching Opportunities
              </h2>
              <p className="text-xs text-[#9DA9C6]">
                Customer requirements matching your product & service profile
              </p>
            </div>
            <Link
              to="/vendor/opportunities"
              className="text-xs font-mono-tech font-bold text-[#6B8CFF] hover:underline flex items-center gap-1"
            >
              Explore all ({openOpportunities.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {openOpportunities.slice(0, 4).map((req) => (
              <Card key={req.id} variant="interactive" className="space-y-4 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono-tech px-2.5 py-0.5 rounded bg-[#131A32] text-[#9DA9C6] border border-white/10">
                        {req.id}
                      </span>
                      <StatusBadge status="OPEN" size="sm" />
                      <span className="text-xs text-[#9DA9C6] font-mono-tech">
                        {req.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#F5F7FF]">
                      {req.title}
                    </h3>

                    <p className="text-xs text-[#9DA9C6] line-clamp-1 leading-relaxed">
                      {req.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs font-mono-tech text-[#9DA9C6]">
                      <span className="text-[#F5F7FF]">
                        Quantity: {req.quantity} {req.unit}
                      </span>
                      <span>•</span>
                      <span className="font-bold text-[#2BD696]">
                        Max Budget: {formatINR(req.maxBudget)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#6F7D9C]" /> {req.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#6F7D9C]" /> {req.deadline}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/8">
                    <span className="text-xs font-mono-tech text-[#6F7D9C]">
                      {req.offersCount} bids submitted
                    </span>
                    <Link to={`/vendor/opportunities/${req.id}/offer`}>
                      <Button size="sm" variant="primary" leftIcon={<Tag className="w-3.5 h-3.5" />}>
                        Submit Quote
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Active Vendor Orders */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#F5F7FF] flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#6B8CFF]" /> Orders to Fulfill
                </h2>
                <p className="text-xs text-[#9DA9C6]">
                  Active customer orders created from your accepted quotations
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {myOrders.slice(0, 3).map((order) => (
                <Card key={order.id} variant="default" className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono-tech font-bold text-[#6B8CFF]">
                          {order.id}
                        </span>
                        <StatusBadge status={order.status} size="sm" />
                      </div>
                      <h4 className="text-sm font-bold text-[#F5F7FF]">
                        {order.title}
                      </h4>
                      <div className="text-xs text-[#9DA9C6] font-mono-tech">
                        Customer: <span className="font-medium text-[#F5F7FF]">{order.customerName}</span> • Target Delivery: {order.expectedDelivery}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-right">
                        <div className="text-base font-extrabold text-[#2BD696] font-mono-tech">
                          {formatINR(order.totalAmount)}
                        </div>
                      </div>
                      <Link to={`/orders/${order.id}`}>
                        <Button variant="outline" size="sm" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                          View Timeline
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Performance & Quick Controls (1 Col) */}
        <div className="space-y-6">
          <Card variant="elevated" className="space-y-5">
            <div className="flex items-center justify-between border-b border-white/8 pb-4 font-mono-tech">
              <h3 className="text-sm font-bold text-[#F5F7FF] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#2BD696]" /> Performance Metrics
              </h3>
              <span className="text-xs font-bold px-2.5 py-0.5 bg-[#2BD696]/15 text-[#2BD696] rounded-full border border-[#2BD696]/30">
                Rating ⭐ 4.9
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono-tech mb-1.5">
                  <span className="text-[#9DA9C6]">Quote Win Rate</span>
                  <span className="text-[#F5F7FF] font-bold">38%</span>
                </div>
                <div className="w-full bg-[#131A32] h-2 rounded-full overflow-hidden border border-white/10">
                  <div className="bg-[#2BD696] h-full w-[38%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono-tech mb-1.5">
                  <span className="text-[#9DA9C6]">Trust Score</span>
                  <span className="text-[#F5F7FF] font-bold">96 / 100</span>
                </div>
                <div className="w-full bg-[#131A32] h-2 rounded-full overflow-hidden border border-white/10">
                  <div className="bg-[#5B37F5] h-full w-[96%]" />
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-xs font-mono-tech text-[#9DA9C6]">
                <span>Avg. Response Time</span>
                <span className="text-[#F5F7FF] font-bold bg-[#131A32] px-2.5 py-1 rounded border border-white/10">1.2 Hours</span>
              </div>
            </div>
          </Card>

          <Card variant="elevated" className="space-y-4">
            <h3 className="text-xs font-bold font-mono-tech text-[#9DA9C6] uppercase tracking-wider">Quick Vendor Actions</h3>
            <div className="space-y-2">
              <Link
                to="/vendor/opportunities"
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#131A32] border border-white/8 hover:border-[#5B37F5]/50 text-[#9DA9C6] hover:text-[#F5F7FF] text-xs font-mono-tech font-semibold transition-all"
              >
                <span>Browse Opportunity Feed</span>
                <Zap className="w-4 h-4 text-[#FAB505]" />
              </Link>
              <Link
                to="/vendor/products"
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#131A32] border border-white/8 hover:border-[#5B37F5]/50 text-[#9DA9C6] hover:text-[#F5F7FF] text-xs font-mono-tech font-semibold transition-all"
              >
                <span>Manage Product Catalog</span>
                <Package className="w-4 h-4 text-[#6B8CFF]" />
              </Link>
              <Link
                to="/vendor/orders"
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#131A32] border border-white/8 hover:border-[#5B37F5]/50 text-[#9DA9C6] hover:text-[#F5F7FF] text-xs font-mono-tech font-semibold transition-all"
              >
                <span>View Active Orders</span>
                <ArrowRight className="w-4 h-4 text-[#6B8CFF]" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default VendorDashboard;
