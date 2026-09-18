import { mockUsers, mockRequirements, mockOffers, mockOrders, mockProducts } from '../../mock/seedData';
import { delay, createResponse, ApiResponse } from './client';

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
    await delay(200);
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
  },
};
