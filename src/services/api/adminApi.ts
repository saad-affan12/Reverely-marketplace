import { User } from '../../types';
import { apiClient, ApiResponse, createResponse } from './client';
import { mockUsers, mockRequirements, mockOffers, mockOrders, mockProducts } from '../../mock/seedData';

export interface AdminStats {
  totalCustomers: number;
  totalVendors: number;
  totalProducts: number;
  totalRequirements: number;
  totalOffers: number;
  totalOrders: number;
  totalRevenue: number;
}

export const adminApi = {
  async getStats(): Promise<ApiResponse<AdminStats>> {
    try {
      const res = await apiClient.get<{ success: boolean; data: AdminStats }>('/admin/stats');
      return createResponse(res.data.data);
    } catch {
      const customers = mockUsers.filter((u) => u.role === 'customer').length;
      const vendors = mockUsers.filter((u) => u.role === 'vendor').length;
      const revenue = mockOrders.reduce((sum, o) => sum + o.totalAmount, 0);

      return createResponse({
        totalCustomers: customers,
        totalVendors: vendors,
        totalProducts: mockProducts.length,
        totalRequirements: mockRequirements.length,
        totalOffers: mockOffers.length,
        totalOrders: mockOrders.length,
        totalRevenue: revenue,
      });
    }
  },

  async getUsers(params?: { role?: string; search?: string }): Promise<ApiResponse<User[]>> {
    try {
      const res = await apiClient.get<{ success: boolean; data: User[] }>('/admin/users', { params });
      return createResponse(res.data.data);
    } catch {
      return createResponse(mockUsers);
    }
  },

  async toggleUserVerification(id: string): Promise<ApiResponse<User>> {
    try {
      const res = await apiClient.patch<{ success: boolean; data: User }>(`/admin/users/${id}/verify`);
      return createResponse(res.data.data);
    } catch {
      const user = mockUsers.find((u) => u.id === id);
      if (!user) throw new Error('User not found');
      return createResponse({ ...user, verified: !user.verified });
    }
  },
};
