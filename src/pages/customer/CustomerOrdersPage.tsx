import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrderStore } from '../../stores/useOrderStore';
import { Card, Button, StatusBadge, Input, DataTable } from '../../components/ui';
import { Search, Truck, Calendar, Store, ArrowRight } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { PageHero } from '../../components/layout/PageHero';

export const CustomerOrdersPage: React.FC = () => {
  const orders = useOrderStore((state) => state.orders);
  const [search, setSearch] = useState('');

  const filtered = orders.filter((o) =>
    o.title.toLowerCase().includes(search.toLowerCase()) ||
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.vendorName.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: 'id',
      header: 'Order ID',
      render: (o: any) => <span className="font-mono-tech font-bold text-[#6B8CFF]">{o.id}</span>,
    },
    {
      key: 'title',
      header: 'Requirement Title',
      render: (o: any) => <span className="font-bold text-[#F5F7FF]">{o.title}</span>,
    },
    {
      key: 'vendorName',
      header: 'Vendor',
      render: (o: any) => (
        <span className="flex items-center gap-1.5 font-mono-tech text-xs text-[#9DA9C6]">
          <Store className="w-3.5 h-3.5 text-[#6B8CFF]" />
          {o.vendorName}
        </span>
      ),
    },
    {
      key: 'expectedDelivery',
      header: 'Expected Delivery',
      render: (o: any) => (
        <span className="flex items-center gap-1.5 font-mono-tech text-xs text-[#9DA9C6]">
          <Calendar className="w-3.5 h-3.5 text-[#6F7D9C]" />
          {o.expectedDelivery}
        </span>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Total Amount',
      render: (o: any) => (
        <span className="font-extrabold text-[#2BD696] font-mono-tech">
          ₹{o.totalAmount.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (o: any) => <StatusBadge status={o.status} size="sm" />,
    },
    {
      key: 'action',
      header: 'Track',
      render: (o: any) => (
        <Link to={`/orders/${o.id}`}>
          <Button variant="outline" size="sm" leftIcon={<Truck className="w-3.5 h-3.5" />}>
            Track Stepper
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHero
        eyebrow="Order Fulfillment"
        title="My"
        titleHighlight="Orders"
        description="Track delivery status and order details through 6-stage lifecycle stepper"
        bgText="ORDERS"
      />

      <Card variant="elevated" className="mb-6 p-4">
        <Input
          placeholder="Search orders by ID, vendor or title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4 text-[#6F7D9C]" />}
        />
      </Card>

      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(o) => o.id}
        emptyTitle="No orders found"
        emptyDescription="No orders match your search parameters."
        mobileCardRender={(order) => (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-tech font-bold text-[#6B8CFF]">{order.id}</span>
              <StatusBadge status={order.status} size="sm" />
            </div>
            <h4 className="text-sm font-bold text-[#F5F7FF]">{order.title}</h4>
            <div className="text-xs text-[#9DA9C6] space-y-1 font-mono-tech">
              <p>Vendor: {order.vendorName}</p>
              <p>Delivery: {order.expectedDelivery}</p>
              <p className="text-base font-extrabold text-[#2BD696]">₹{order.totalAmount.toLocaleString('en-IN')}</p>
            </div>
            <Link to={`/orders/${order.id}`} className="block pt-2">
              <Button variant="outline" size="sm" className="w-full justify-center" leftIcon={<Truck className="w-4 h-4" />}>
                Track Stepper
              </Button>
            </Link>
          </div>
        )}
      />
    </PageContainer>
  );
};

export default CustomerOrdersPage;
