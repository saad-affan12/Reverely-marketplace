import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Offer } from '../types';
import { mockOffers } from '../mock/seedData';
import { useRequirementStore } from './useRequirementStore';
import { useOrderStore } from './useOrderStore';
import { offersApi } from '../services/api/offersApi';

interface OfferState {
  offers: Offer[];
  isLoading: boolean;
  fetchOffersByRequirementId: (reqId: string) => Promise<void>;
  submitOffer: (offerData: Omit<Offer, 'id' | 'createdAt' | 'status'>) => Offer;
  acceptOffer: (offerId: string) => { offer: Offer; orderId?: string } | null;
  getOffersByRequirementId: (reqId: string) => Offer[];
  getOfferById: (id: string) => Offer | undefined;
}

export const useOfferStore = create<OfferState>()(
  persist(
    (set, get) => ({
      offers: mockOffers,
      isLoading: false,

      fetchOffersByRequirementId: async (reqId: string) => {
        set({ isLoading: true });
        try {
          const res = await offersApi.getOffersByRequirementId(reqId);
          if (res.data && res.data.length > 0) {
            set((state) => {
              const otherOffers = state.offers.filter((o) => o.requirementId !== reqId);
              return { offers: [...otherOffers, ...res.data], isLoading: false };
            });
          } else {
            set({ isLoading: false });
          }
        } catch {
          set({ isLoading: false });
        }
      },

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

        useRequirementStore.getState().incrementOffersCount(offerData.requirementId);

        // Background API sync
        offersApi.submitOffer(offerData).then((res) => {
          if (res.data?.id && res.data.id !== newOffer.id) {
            set((state) => ({
              offers: state.offers.map((o) =>
                o.id === newOffer.id ? res.data : o
              ),
            }));
          }
        }).catch(() => {
          // Keep local optimistic offer
        });

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

        // Background API sync
        offersApi.acceptOffer(offerId).catch(() => {
          // Keep local optimistic order
        });

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
