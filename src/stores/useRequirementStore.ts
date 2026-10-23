import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Requirement, RequirementStatus } from '../types';
import { mockRequirements } from '../mock/seedData';
import { requirementsApi } from '../services/api/requirementsApi';

interface RequirementState {
  requirements: Requirement[];
  isLoading: boolean;
  fetchRequirements: (params?: { search?: string; category?: string; status?: string }) => Promise<void>;
  addRequirement: (reqData: Omit<Requirement, 'id' | 'createdAt' | 'offersCount' | 'status'>) => Requirement;
  updateRequirementStatus: (id: string, status: RequirementStatus) => Promise<void>;
  incrementOffersCount: (id: string) => void;
  getRequirementById: (id: string) => Requirement | undefined;
}

export const useRequirementStore = create<RequirementState>()(
  persist(
    (set, get) => ({
      requirements: mockRequirements,
      isLoading: false,

      fetchRequirements: async (params) => {
        set({ isLoading: true });
        try {
          const res = await requirementsApi.getRequirements(params);
          if (res.data && res.data.length > 0) {
            set({ requirements: res.data, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch {
          set({ isLoading: false });
        }
      },

      addRequirement: (reqData) => {
        const newReq: Requirement = {
          ...reqData,
          id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
          status: 'open',
          offersCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
        };

        // Optimistic state update
        set((state) => ({
          requirements: [newReq, ...state.requirements],
        }));

        // Fire background API sync
        requirementsApi.createRequirement(reqData).then((res) => {
          if (res.data?.id && res.data.id !== newReq.id) {
            set((state) => ({
              requirements: state.requirements.map((r) =>
                r.id === newReq.id ? res.data : r
              ),
            }));
          }
        }).catch(() => {
          // Keep local requirement
        });

        return newReq;
      },

      updateRequirementStatus: async (id, status) => {
        set((state) => ({
          requirements: state.requirements.map((r) =>
            r.id === id ? { ...r, status } : r
          ),
        }));

        try {
          await requirementsApi.updateStatus(id, status);
        } catch {
          // Keep optimistic
        }
      },

      incrementOffersCount: (id) => {
        set((state) => ({
          requirements: state.requirements.map((r) =>
            r.id === id ? { ...r, offersCount: r.offersCount + 1 } : r
          ),
        }));
      },

      getRequirementById: (id) => {
        return get().requirements.find((r) => r.id === id);
      },
    }),
    {
      name: 'reversely_requirement_store',
    }
  )
);
