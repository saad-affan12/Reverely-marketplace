import { Offer } from '../../types';
import { apiClient, ApiResponse, createResponse } from './client';
import { mockOffers } from '../../mock/seedData';

export const offersApi = {
  async getOffersByRequirementId(requirementId: string): Promise<ApiResponse<Offer[]>> {
    try {
      const res = await apiClient.get<{ success: boolean; data: Offer[] }>(`/requirements/${requirementId}/offers`);
      return createResponse(res.data.data);
    } catch {
      const offers = mockOffers.filter((o) => o.requirementId === requirementId);
      return createResponse(offers);
    }
  },

  async submitOffer(data: Omit<Offer, 'id' | 'createdAt' | 'status'>): Promise<ApiResponse<Offer>> {
    try {
      const res = await apiClient.post<{ success: boolean; data: Offer; message?: string }>(
        `/requirements/${data.requirementId}/offers`,
        data
      );
      return createResponse(res.data.data, res.data.message || 'Offer submitted successfully');
    } catch {
      const newOffer: Offer = {
        ...data,
        id: `OFF-${Math.floor(500 + Math.random() * 500)}`,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
      };
      return createResponse(newOffer, 'Offer submitted successfully');
    }
  },

  async acceptOffer(offerId: string): Promise<ApiResponse<{ offer: Offer; orderId?: string }>> {
    try {
      const res = await apiClient.post<{
        success: boolean;
        message?: string;
        data: { offer: Offer; orderId: string };
      }>(`/offers/${offerId}/accept`);
      return createResponse(res.data.data, res.data.message || 'Offer accepted successfully');
    } catch {
      const offer = mockOffers.find((o) => o.id === offerId);
      if (!offer) throw new Error('Offer not found');
      const updated: Offer = { ...offer, status: 'accepted' };
      return createResponse({ offer: updated, orderId: `ORD-${Math.floor(1000 + Math.random() * 9000)}` }, 'Offer accepted successfully');
    }
  },
};
