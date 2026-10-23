import { Product } from '../../types';
import { apiClient, ApiResponse, createResponse } from './client';
import { mockProducts } from '../../mock/seedData';

export const productsApi = {
  async getProducts(params?: { search?: string; category?: string }): Promise<ApiResponse<Product[]>> {
    try {
      const res = await apiClient.get<{ success: boolean; data: Product[] }>('/products', { params });
      return createResponse(res.data.data);
    } catch {
      return createResponse(mockProducts);
    }
  },

  async getProductById(id: string): Promise<ApiResponse<Product | null>> {
    try {
      const res = await apiClient.get<{ success: boolean; data: Product }>(`/products/${id}`);
      return createResponse(res.data.data);
    } catch {
      const prod = mockProducts.find((p) => p.id === id) || null;
      return createResponse(prod);
    }
  },

  async createProduct(data: Omit<Product, 'id'>): Promise<ApiResponse<Product>> {
    try {
      const res = await apiClient.post<{ success: boolean; data: Product; message?: string }>('/products', data);
      return createResponse(res.data.data, res.data.message || 'Product created');
    } catch {
      const newProd: Product = {
        ...data,
        id: `PRD-${Math.floor(100 + Math.random() * 900)}`,
      };
      return createResponse(newProd, 'Product created');
    }
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<ApiResponse<Product>> {
    try {
      const res = await apiClient.patch<{ success: boolean; data: Product; message?: string }>(`/products/${id}`, data);
      return createResponse(res.data.data, res.data.message || 'Product updated');
    } catch {
      const prod = mockProducts.find((p) => p.id === id);
      if (!prod) throw new Error('Product not found');
      return createResponse({ ...prod, ...data }, 'Product updated');
    }
  },

  async deleteProduct(id: string): Promise<ApiResponse<string>> {
    try {
      await apiClient.delete(`/products/${id}`);
      return createResponse(id, 'Product deleted');
    } catch {
      return createResponse(id, 'Product deleted');
    }
  },
};
