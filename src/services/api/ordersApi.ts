import { Order, OrderStatus } from '../../types';
import { apiClient, ApiResponse, createResponse } from './client';
import { mockOrders } from '../../mock/seedData';

export const ordersApi = {
  async getOrders(): Promise<ApiResponse<Order[]>> {
    try {
      const res = await apiClient.get<{ success: boolean; data: Order[] }>('/orders');
      return createResponse(res.data.data);
    } catch {
      return createResponse(mockOrders);
    }
  },

  async getOrderById(id: string): Promise<ApiResponse<Order | null>> {
    try {
      const res = await apiClient.get<{ success: boolean; data: Order }>(`/orders/${id}`);
      return createResponse(res.data.data);
    } catch {
      const order = mockOrders.find((o) => o.id === id) || null;
      return createResponse(order);
    }
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<ApiResponse<Order>> {
    try {
      const res = await apiClient.patch<{ success: boolean; data: Order }>(`/orders/${id}/status`, { status });
      return createResponse(res.data.data, 'Order status updated');
    } catch {
      const order = mockOrders.find((o) => o.id === id);
      if (!order) throw new Error('Order not found');
      return createResponse({ ...order, status }, 'Order status updated');
    }
  },
};
