import { Order, OrderStatus, OrderTimelineItem } from '../../types';
import { mockOrders } from '../../mock/seedData';
import { delay, createResponse, ApiResponse } from './client';

export const ordersApi = {
  async getOrders(): Promise<ApiResponse<Order[]>> {
    await delay(200);
    return createResponse(mockOrders);
  },

  async getOrderById(id: string): Promise<ApiResponse<Order | null>> {
    await delay(150);
    const order = mockOrders.find((o) => o.id === id) || null;
    return createResponse(order);
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<ApiResponse<Order>> {
    await delay(250);
    const order = mockOrders.find((o) => o.id === id);
    if (!order) throw new Error('Order not found');

    const updatedTimeline: OrderTimelineItem[] = order.timeline.map((item) => {
      if (item.status === status) {
        return { ...item, completed: true, timestamp: new Date().toISOString() };
      }
      return item;
    });

    const updated: Order = {
      ...order,
      status,
      timeline: updatedTimeline,
    };
    return createResponse(updated, 'Order status updated');
  },
};
