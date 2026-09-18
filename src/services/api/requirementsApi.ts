import { Requirement, RequirementStatus } from '../../types';
import { mockRequirements } from '../../mock/seedData';
import { delay, createResponse, ApiResponse } from './client';

export const requirementsApi = {
  async getRequirements(): Promise<ApiResponse<Requirement[]>> {
    await delay(200);
    return createResponse(mockRequirements);
  },

  async getRequirementById(id: string): Promise<ApiResponse<Requirement | null>> {
    await delay(150);
    const req = mockRequirements.find((r) => r.id === id) || null;
    return createResponse(req);
  },

  async createRequirement(data: Omit<Requirement, 'id' | 'createdAt' | 'offersCount' | 'status'>): Promise<ApiResponse<Requirement>> {
    await delay(300);
    const newReq: Requirement = {
      ...data,
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'open',
      offersCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    return createResponse(newReq, 'Requirement posted successfully');
  },

  async updateStatus(id: string, status: RequirementStatus): Promise<ApiResponse<Requirement>> {
    await delay(200);
    const req = mockRequirements.find((r) => r.id === id);
    if (!req) throw new Error('Requirement not found');
    const updated = { ...req, status };
    return createResponse(updated);
  },
};
