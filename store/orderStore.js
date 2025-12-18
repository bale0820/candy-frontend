import { create } from "zustand";

export const useOrdersStore = create((set, get) => ({
    orders: [],

    setOrders : (list) => {
        set({ orders: list });
    },

}));
