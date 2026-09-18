import React, { useState } from 'react';
import { ShoppingBag, TrendingUp, Truck, CheckCircle2, Clock } from 'lucide-react';
import { useOrderStore } from '../../stores/useOrderStore';
import { Order, OrderStatus } from '../../types';
import { Button, Badge, Toast } from '../../components/ui';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminDataTable, Column } from '../../components/admin/AdminDataTable';
import { AdminOrderAuditModal } from '../../components/admin/AdminOrderAuditModal';

export const AdminOrdersPage: React.FC = () => {
  const { orders } = useOrderStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [selectedAuditOrder, setSelectedAuditOrder] = useState<Order | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getOrderStatusVariant = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
      case 'packed':
        return 'info';
      case 'processing':
      case 'confirmed':
      case 'requirement_accepted':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.vendorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalGMV = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const activeProcessing = orders.filter((o) => o.status === 'processing' || o.status === 'confirmed').length;
  const shippedCount = orders.filter((o) => o.status === 'shipped' || o.status === 'packed').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;

  const columns: Column<Order>[] = [
    {
      header: 'Order ID',
      accessorKey: 'id',
      cell: (order) => (
        <span className="font-mono text-xs font-bold text-indigo-400">{order.id}</span>
      ),
    },
    {
      header: 'Title / Item',
      accessorKey: 'title',
      cell: (order) => (
        <div className="max-w-[220px] truncate space-y-0.5">
          <p className="font-sans font-bold text-white truncate">{order.title}</p>
          <p className="text-[10px] text-slate-500 font-mono-tech">
            Delivery: {order.expectedDelivery}
          </p>
        </div>
      ),
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
      cell: (order) => <span className="text-slate-300 font-medium">{order.customerName}</span>,
    },
    {
      header: 'Vendor',
      accessorKey: 'vendorName',
      cell: (order) => <span className="text-slate-300 font-medium">{order.vendorName}</span>,
    },
    {
      header: 'Amount',
      accessorKey: 'totalAmount',
      cell: (order) => (
        <span className="font-bold text-white font-mono-tech">
          {formatCurrency(order.totalAmount)}
        </span>
      ),
    },
    {
      header: 'Fulfillment Status',
      accessorKey: 'status',
      cell: (order) => (
        <Badge variant={getOrderStatusVariant(order.status)}>
          {order.status.replace('_', ' ').toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Action',
      cell: (order) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setSelectedAuditOrder(order);
            setIsAuditModalOpen(true);
          }}
          className="border-slate-800 text-indigo-400 hover:bg-slate-900 text-xs font-mono-tech"
        >
          Track & Audit
        </Button>
      ),
      className: 'text-right',
    },
  ];

  return (
    <AdminLayout
      watermark="ORDERS"
      eyebrow="FULFILLMENT & LOGISTICS"
      title="Orders in Motion."
      description="Audit order fulfillments, track delivery progress, and resolve vendor/customer disputes across India."
      metrics={
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-tech pt-2">
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800/50">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Total Settlement GMV</p>
              <p className="text-base font-bold text-white">{formatCurrency(totalGMV)}</p>
            </div>
          </div>
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-950 text-amber-400 border border-amber-800/50">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Processing</p>
              <p className="text-base font-bold text-white">{activeProcessing}</p>
            </div>
          </div>
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-950 text-blue-400 border border-blue-800/50">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase">In Transit / Shipped</p>
              <p className="text-base font-bold text-white">{shippedCount}</p>
            </div>
          </div>
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/50">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Delivered</p>
              <p className="text-base font-bold text-white">{deliveredCount}</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {toastMessage && (
          <Toast
            id="admin-orders-toast"
            message={toastMessage}
            type="info"
            onClose={() => setToastMessage(null)}
          />
        )}

        <AdminDataTable
          data={filteredOrders}
          columns={columns}
          keyExtractor={(o) => o.id}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search Order ID, title, vendor or customer..."
          filters={[
            {
              id: 'status',
              label: 'Status',
              value: statusFilter,
              options: [
                { value: 'all', label: 'All Order Statuses' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'processing', label: 'Processing' },
                { value: 'packed', label: 'Packed' },
                { value: 'shipped', label: 'Shipped' },
                { value: 'delivered', label: 'Delivered' },
              ],
              onChange: setStatusFilter,
            },
          ]}
        />
      </div>

      <AdminOrderAuditModal
        order={selectedAuditOrder}
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />
    </AdminLayout>
  );
};
