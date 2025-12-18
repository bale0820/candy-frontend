import { create } from "zustand";

export const useProductStore = create((set) => ({
    item: null,
    setItem: (item) => set({ item }),
}));