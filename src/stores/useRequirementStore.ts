import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Requirement, RequirementStatus } from '../types';
import { mockRequirements } from '../mock/seedData';

interface RequirementState {
  requirements: Requirement[];
  addRequirement: (reqData: Omit<Requirement, 'id' | 'createdAt' | 'offersCount' | 'status'>) => Requirement;
  updateRequirementStatus: (id: string, status: RequirementStatus) => void;
  incrementOffersCount: (id: string) => void;
  getRequirementById: (id: string) => Requirement | undefined;
}

export const useRequirementStore = create<RequirementState>()(
  persist(
    (set, get) => ({
      requirements: mockRequirements,

      addRequirement: (reqData) => {
        const newReq: Requirement = {
          ...reqData,
          id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
          status: 'open',
          offersCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({
          requirements: [newReq, ...state.requirements],
        }));
        return newReq;
      },

      updateRequirementStatus: (id, status) => {
        set((state) => ({
          requirements: state.requirements.map((r) =>
            r.id === id ? { ...r, status } : r
          ),
        }));
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
