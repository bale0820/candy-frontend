import { create } from "zustand";

export const useSelectSubStore = create((set, get) => ({
    selectSub: null,

    setSelectSub : (subId) => {
        set({ selectSub: subId });
    },

}));
