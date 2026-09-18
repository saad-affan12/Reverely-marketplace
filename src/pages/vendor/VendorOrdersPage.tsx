import React from 'react';
import { Link } from 'react-router-dom';
import { useOrderStore } from '../../stores/useOrderStore';
import { Card, Button, StatusBadge } from '../../components/ui';
import { PageContainer, PageHero } from '../../components/layout';
import { Package, Truck, ArrowRight, User } from 'lucide-react';

export const VendorOrdersPage: React.FC = () => {
  const orders = useOrderStore((state) => state.orders);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <PageContainer bgText="ORDERS">
      <div className="space-y-8">
        <PageHero
          eyebrow="SUPPLIER FULFILLMENT MATRIX"
          title="Fulfillment Orders"
          titleHighlight="Logistics"
          description="Track incoming customer orders, manage manufacturing & packing stages, and dispatch shipments."
          bgText="ORDERS"
        />

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} variant="default" className="p-6 border-slate-800">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono-tech">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-indigo-400 bg-indigo-950/80 px-2.5 py-1 rounded-md border border-indigo-800/50">
                      {order.id}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                  <h3 className="text-lg font-bold text-white font-sans">{order.title}</h3>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-500" /> Customer: <strong className="text-slate-200">{order.customerName}</strong>
                    </span>
                    <span className="font-semibold text-white">
                      Total Value: <span className="text-indigo-400">{formatCurrency(order.totalAmount)}</span>
                    </span>
                  </div>
                </div>

                <Link to={`/orders/${order.id}`}>
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5">
                    <Truck className="w-4 h-4 mr-2" /> Manage Fulfillment <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};

export default VendorOrdersPage;

