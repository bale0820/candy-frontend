// useRecentCategoryStore.ts
import { create } from "zustand";

export const useRecentCategoryStore = create((set) => ({
  recentSubCategory: 20,
  setRecentSubCategory: (value) => set({ recentSubCategory: value }),
}));
