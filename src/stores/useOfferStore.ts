import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Offer } from '../types';
import { mockOffers } from '../mock/seedData';
import { useRequirementStore } from './useRequirementStore';
import { useOrderStore } from './useOrderStore';

interface OfferState {
  offers: Offer[];
  submitOffer: (offerData: Omit<Offer, 'id' | 'createdAt' | 'status'>) => Offer;
  acceptOffer: (offerId: string) => { offer: Offer; orderId?: string } | null;
  getOffersByRequirementId: (reqId: string) => Offer[];
  getOfferById: (id: string) => Offer | undefined;
}

export const useOfferStore = create<OfferState>()(
  persist(
    (set, get) => ({
      offers: mockOffers,

      submitOffer: (offerData) => {
        const newOffer: Offer = {
          ...offerData,
          id: `OFF-${Math.floor(500 + Math.random() * 500)}`,
          status: 'pending',
          createdAt: new Date().toISOString().split('T')[0],
        };

        set((state) => ({
          offers: [newOffer, ...state.offers],
        }));

        // Increment offers count on the requirement
        useRequirementStore.getState().incrementOffersCount(offerData.requirementId);

        return newOffer;
      },

      acceptOffer: (offerId) => {
        const allOffers = get().offers;
        const targetOffer = allOffers.find((o) => o.id === offerId);
        if (!targetOffer) return null;

        // 1. Mark this offer as accepted, others for the same req as rejected
        const updatedOffers = allOffers.map((o) => {
          if (o.id === offerId) return { ...o, status: 'accepted' as const };
          if (o.requirementId === targetOffer.requirementId && o.status === 'pending') {
            return { ...o, status: 'rejected' as const };
          }
          return o;
        });

        set({ offers: updatedOffers });

        // 2. Mark requirement as fulfilled
        const reqStore = useRequirementStore.getState();
        reqStore.updateRequirementStatus(targetOffer.requirementId, 'fulfilled');
        const req = reqStore.getRequirementById(targetOffer.requirementId);

        let createdOrderId: string | undefined;
        if (req) {
          // 3. Automatically create new Order with 6-stage timeline
          const orderStore = useOrderStore.getState();
          const newOrder = orderStore.createOrderFromOffer(targetOffer, req);
          createdOrderId = newOrder.id;
        }

        return { offer: { ...targetOffer, status: 'accepted' }, orderId: createdOrderId };
      },

      getOffersByRequirementId: (reqId) => {
        return get().offers.filter((o) => o.requirementId === reqId);
      },

      getOfferById: (id) => {
        return get().offers.find((o) => o.id === id);
      },
    }),
    {
      name: 'reversely_offer_store',
    }
  )
);
