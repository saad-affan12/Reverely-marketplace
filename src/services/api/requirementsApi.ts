import { Requirement, RequirementStatus } from '../../types';
import { apiClient, ApiResponse, createResponse } from './client';
import { mockRequirements } from '../../mock/seedData';

export const requirementsApi = {
  async getRequirements(params?: { search?: string; category?: string; status?: string }): Promise<ApiResponse<Requirement[]>> {
    try {
      const res = await apiClient.get<{ success: boolean; data: Requirement[] }>('/requirements', { params });
      return createResponse(res.data.data);
    } catch {
      return createResponse(mockRequirements);
    }
  },

  async getRequirementById(id: string): Promise<ApiResponse<Requirement | null>> {
    try {
      const res = await apiClient.get<{ success: boolean; data: Requirement }>(`/requirements/${id}`);
      return createResponse(res.data.data);
    } catch {
      const fallback = mockRequirements.find((r) => r.id === id) || null;
      return createResponse(fallback);
    }
  },

  async createRequirement(data: Omit<Requirement, 'id' | 'createdAt' | 'offersCount' | 'status'>): Promise<ApiResponse<Requirement>> {
    try {
      const res = await apiClient.post<{ success: boolean; data: Requirement; message?: string }>('/requirements', data);
      return createResponse(res.data.data, res.data.message || 'Requirement posted successfully');
    } catch {
      // Local fallback
      const newReq: Requirement = {
        ...data,
        id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'open',
        offersCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };
      return createResponse(newReq, 'Requirement posted successfully');
    }
  },

  async updateStatus(id: string, status: RequirementStatus): Promise<ApiResponse<Requirement>> {
    try {
      const res = await apiClient.patch<{ success: boolean; data: Requirement }>(`/requirements/${id}/status`, { status });
      return createResponse(res.data.data);
    } catch {
      const req = mockRequirements.find((r) => r.id === id);
      if (!req) throw new Error('Requirement not found');
      return createResponse({ ...req, status });
    }
  },
};
