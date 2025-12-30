"use client";

import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  cartList: [],
  cartCount: 0,
  totalPrice: 0,
  totalDcPrice: 0,
  shippingFee: 3000,

  setCartList: (list) => {
    set({ cartList: list });
    get().calcTotals();
  },

  clearCart: () => {
    set({
      cartList: [],
      cartCount: 0,
      totalPrice: 0,
      totalDcPrice: 0,
      shippingFee: 3000,
    });
  },

  calcTotals: () => {
    const totalList = get().cartList;
    const list = totalList.filter(
      (item) => item.product?.count > 0
    );

    const total = list.reduce(
      (acc, item) => acc + item.qty * item.product.price,
      0
    );

    const dcTotal = list.reduce(
      (acc, item) =>
        acc + item.qty * (item.product.price * item.product.dc * 0.01),
      0
    );

    set({
      cartCount: totalList.length,
      totalPrice: total,
      totalDcPrice: dcTotal,
      shippingFee: total >= 30000 ? 0 : 3000,
    });
  },
}));
