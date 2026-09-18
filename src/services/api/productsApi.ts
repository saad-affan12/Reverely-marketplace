import { Product } from '../../types';
import { mockProducts } from '../../mock/seedData';
import { delay, createResponse, ApiResponse } from './client';

export const productsApi = {
  async getProducts(): Promise<ApiResponse<Product[]>> {
    await delay(200);
    return createResponse(mockProducts);
  },

  async getProductById(id: string): Promise<ApiResponse<Product | null>> {
    await delay(150);
    const prod = mockProducts.find((p) => p.id === id) || null;
    return createResponse(prod);
  },

  async createProduct(data: Omit<Product, 'id'>): Promise<ApiResponse<Product>> {
    await delay(300);
    const newProd: Product = {
      ...data,
      id: `PRD-${Math.floor(100 + Math.random() * 900)}`,
    };
    return createResponse(newProd, 'Product created');
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<ApiResponse<Product>> {
    await delay(250);
    const prod = mockProducts.find((p) => p.id === id);
    if (!prod) throw new Error('Product not found');
    const updated = { ...prod, ...data };
    return createResponse(updated, 'Product updated');
  },

  async deleteProduct(id: string): Promise<ApiResponse<string>> {
    await delay(200);
    return createResponse(id, 'Product deleted');
  },
};
