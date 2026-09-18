import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Tag,
  Package,
  CheckCircle2,
  Plus,
  ArrowRight,
  Clock,
  MapPin,
  TrendingUp,
  Search,
  ShoppingBag,
  Eye,
} from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useRequirementStore } from '../../stores/useRequirementStore';
import { useOrderStore } from '../../stores/useOrderStore';
import { StatCard, Card, StatusBadge, Button } from '../../components/ui';
import { PageContainer } from '../../components/layout/PageContainer';
import { PageHero } from '../../components/layout/PageHero';

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { requirements } = useRequirementStore();
  const { orders } = useOrderStore();

  const customerRequirements = requirements.filter(
    (r) => !user || r.customerId === user.id || r.customerId === 'user-cust-1'
  );

  const customerOrders = orders.filter(
    (o) => !user || o.customerId === user.id || o.customerId === 'user-cust-1'
  );

  const activeReqs = customerRequirements.filter((r) => r.status === 'open');
  const activeOrders = customerOrders.filter((o) => o.status !== 'delivered');
  const completedOrders = customerOrders.filter((o) => o.status === 'delivered');

  const totalOffersReceived = customerRequirements.reduce(
    (sum, r) => sum + r.offersCount,
    0
  );

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <PageContainer>
      {/* Hero Header */}
      <PageHero
        eyebrow="Customer Workspace"
        title="Good day,"
        titleHighlight={user?.name || 'Saad'}
        description="Manage your active requirements, review incoming vendor bids, and track live order fulfillments."
        bgText="CONTROL"
        action={
          <Link to="/customer/requirements/new">
            <Button size="lg" variant="primary" leftIcon={<Plus className="w-5 h-5" />}>
              Post New Requirement
            </Button>
          </Link>
        }
      />

      {/* StatCards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Active Requirements"
          value={activeReqs.length}
          change="+2 this week"
          isPositive={true}
          icon={<FileText className="w-5 h-5" />}
          subtitle="Open for bids"
        />
        <StatCard
          title="Offers Received"
          value={totalOffersReceived}
          change="5 new quotes"
          isPositive={true}
          icon={<Tag className="w-5 h-5" />}
          subtitle="Competitive quotations"
        />
        <StatCard
          title="Active Orders"
          value={activeOrders.length}
          icon={<Package className="w-5 h-5" />}
          subtitle="In fulfillment"
        />
        <StatCard
          title="Completed Orders"
          value={completedOrders.length}
          icon={<CheckCircle2 className="w-5 h-5" />}
          subtitle="Successfully delivered"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Requirements (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#F5F7FF] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#6B8CFF]" /> Your Requirements
              </h2>
              <p className="text-xs text-[#9DA9C6]">
                Manage requirements and review incoming vendor offers
              </p>
            </div>
            <Link
              to="/customer/requirements"
              className="text-xs font-mono-tech font-bold text-[#6B8CFF] hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {customerRequirements.length === 0 ? (
              <Card className="text-center py-12">
                <FileText className="w-10 h-10 text-[#6F7D9C] mx-auto mb-2" />
                <p className="text-[#F5F7FF] font-medium">No requirements posted yet</p>
                <p className="text-xs text-[#9DA9C6] max-w-sm mx-auto mb-4">
                  Post your first requirement to get competitive quotes from verified vendors.
                </p>
                <Link to="/customer/requirements/new">
                  <Button size="sm" variant="primary">Post Requirement</Button>
                </Link>
              </Card>
            ) : (
              customerRequirements.slice(0, 4).map((req) => (
                <Card key={req.id} variant="interactive" className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono-tech px-2.5 py-0.5 rounded bg-[#131A32] text-[#9DA9C6] border border-white/10">
                          {req.id}
                        </span>
                        <StatusBadge status={req.status} size="sm" />
                        <span className="text-xs text-[#9DA9C6] font-mono-tech">
                          {req.category}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-[#F5F7FF]">
                        {req.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs font-mono-tech text-[#9DA9C6]">
                        <span className="text-[#F5F7FF]">
                          Qty: {req.quantity} {req.unit}
                        </span>
                        <span>•</span>
                        <span className="text-[#2BD696] font-bold">
                          Budget: {formatINR(req.maxBudget)}
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
                      <div className="text-left sm:text-right">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold font-mono-tech bg-[#5B37F5]/15 text-[#6B8CFF] border border-[#5B37F5]/30">
                          <Tag className="w-3.5 h-3.5" /> {req.offersCount} Offers
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link to={`/customer/requirements/${req.id}`}>
                          <Button variant="outline" size="sm" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                            View Offers
                          </Button>
                        </Link>
                        {req.offersCount > 1 && (
                          <Link to={`/customer/requirements/${req.id}/compare`}>
                            <Button size="sm" variant="primary">Compare</Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Recent Orders Section */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#F5F7FF] flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#2BD696]" /> Recent Orders
                </h2>
                <p className="text-xs text-[#9DA9C6]">
                  Track delivery progress of accepted vendor offers
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {customerOrders.slice(0, 3).map((order) => (
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
                        Vendor: <span className="font-medium text-[#F5F7FF]">{order.vendorName}</span> • Expected Delivery: {order.expectedDelivery}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-right">
                        <div className="text-base font-extrabold text-[#2BD696] font-mono-tech">
                          {formatINR(order.totalAmount)}
                        </div>
                      </div>
                      <Link to={`/orders/${order.id}`}>
                        <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                          Track Order
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Side Banner (1 Col) */}
        <div className="space-y-6">
          <Card variant="feature" className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#5B37F5]/30 border border-[#5B37F5]/50 flex items-center justify-center text-[#6B8CFF]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#F5F7FF]">Reverse Bidding Power</h3>
            <p className="text-xs text-[#9DA9C6] leading-relaxed">
              Post your exact budget and specifications. Verified suppliers compete directly for your business with transparent price and warranty metrics.
            </p>
            <div className="pt-2">
              <Link to="/customer/requirements/new" className="block">
                <Button variant="primary" size="md" className="w-full">
                  + Post Requirement Now
                </Button>
              </Link>
            </div>
          </Card>

          <Card variant="elevated" className="space-y-4">
            <h3 className="text-xs font-bold font-mono-tech text-[#9DA9C6] uppercase tracking-wider flex items-center gap-2">
              <Search className="w-4 h-4 text-[#6B8CFF]" /> Quick Actions
            </h3>
            <div className="space-y-2">
              <Link
                to="/customer/requirements/new"
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#131A32] border border-white/8 hover:border-[#5B37F5]/50 text-[#9DA9C6] hover:text-[#F5F7FF] text-xs font-mono-tech font-semibold transition-all"
              >
                <span>Post New Requirement</span>
                <Plus className="w-4 h-4 text-[#6B8CFF]" />
              </Link>
              <Link
                to="/explore"
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#131A32] border border-white/8 hover:border-[#5B37F5]/50 text-[#9DA9C6] hover:text-[#F5F7FF] text-xs font-mono-tech font-semibold transition-all"
              >
                <span>Explore Marketplace</span>
                <Search className="w-4 h-4 text-[#6B8CFF]" />
              </Link>
              <Link
                to="/how-it-works"
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#131A32] border border-white/8 hover:border-[#5B37F5]/50 text-[#9DA9C6] hover:text-[#F5F7FF] text-xs font-mono-tech font-semibold transition-all"
              >
                <span>How Bidding Works</span>
                <ArrowRight className="w-4 h-4 text-[#6B8CFF]" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default CustomerDashboard;
