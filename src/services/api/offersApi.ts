import { Offer } from '../../types';
import { mockOffers } from '../../mock/seedData';
import { delay, createResponse, ApiResponse } from './client';

export const offersApi = {
  async getOffersByRequirementId(requirementId: string): Promise<ApiResponse<Offer[]>> {
    await delay(200);
    const offers = mockOffers.filter((o) => o.requirementId === requirementId);
    return createResponse(offers);
  },

  async submitOffer(data: Omit<Offer, 'id' | 'createdAt' | 'status'>): Promise<ApiResponse<Offer>> {
    await delay(350);
    const newOffer: Offer = {
      ...data,
      id: `OFF-${Math.floor(500 + Math.random() * 500)}`,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    return createResponse(newOffer, 'Offer submitted successfully');
  },

  async acceptOffer(offerId: string): Promise<ApiResponse<Offer>> {
    await delay(300);
    const offer = mockOffers.find((o) => o.id === offerId);
    if (!offer) throw new Error('Offer not found');
    const updated: Offer = { ...offer, status: 'accepted' };
    return createResponse(updated, 'Offer accepted successfully');
  },
};
