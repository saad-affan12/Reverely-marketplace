import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, OrderStatus, OrderTimelineItem, Offer, Requirement } from '../types';
import { mockOrders } from '../mock/seedData';

interface OrderState {
  orders: Order[];
  createOrderFromOffer: (offer: Offer, requirement: Requirement) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (id: string) => Order | undefined;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: mockOrders,

      createOrderFromOffer: (offer, requirement) => {
        const today = new Date();
        const expectedDate = new Date(today);
        expectedDate.setDate(today.getDate() + offer.deliveryDays);
        const dateFormatted = expectedDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });

        const defaultTimeline: OrderTimelineItem[] = [
          {
            status: 'requirement_accepted',
            label: 'Requirement Accepted',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            completed: true,
          },
          {
            status: 'confirmed',
            label: 'Order Confirmed',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            completed: true,
          },
          {
            status: 'processing',
            label: 'Processing & Customization',
            timestamp: 'In Progress',
            completed: false,
          },
          {
            status: 'packed',
            label: 'Packed & Quality Checked',
            timestamp: 'Pending',
            completed: false,
          },
          {
            status: 'shipped',
            label: 'Shipped via Express Courier',
            timestamp: 'Pending',
            completed: false,
          },
          {
            status: 'delivered',
            label: 'Delivered to Customer',
            timestamp: 'Pending',
            completed: false,
          },
        ];

        const newOrder: Order = {
          id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
          requirementId: requirement.id,
          offerId: offer.id,
          customerId: requirement.customerId,
          customerName: requirement.customerName,
          vendorId: offer.vendorId,
          vendorName: offer.vendorName,
          title: requirement.title,
          totalAmount: offer.price,
          status: 'confirmed',
          expectedDelivery: dateFormatted,
          timeline: defaultTimeline,
          createdAt: new Date().toISOString().split('T')[0],
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));

        return newOrder;
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((ord) => {
            if (ord.id !== orderId) return ord;

            const orderStatusSequence: OrderStatus[] = [
              'requirement_accepted',
              'confirmed',
              'processing',
              'packed',
              'shipped',
              'delivered',
            ];

            const targetIndex = orderStatusSequence.indexOf(status);

            const updatedTimeline = ord.timeline.map((item) => {
              const itemIndex = orderStatusSequence.indexOf(item.status);
              if (itemIndex <= targetIndex) {
                return {
                  ...item,
                  completed: true,
                  timestamp: item.timestamp === 'Pending' || item.timestamp === 'In Progress'
                    ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : item.timestamp,
                };
              }
              return item;
            });

            return {
              ...ord,
              status,
              timeline: updatedTimeline,
            };
          }),
        }));
      },

      getOrderById: (id) => {
        return get().orders.find((o) => o.id === id);
      },
    }),
    {
      name: 'reversely_order_store',
    }
  )
);
