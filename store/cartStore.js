
// import { create } from "zustand";

// export const useCartStore = create((set, get) => ({
//   cartList: [],
//   cartCount: 0,
//   totalPrice: 0,
//   totalDcPrice: 0,
//   shippingFee: 3000,

//   // 서버에서 받아온 cartList 세팅
//   setCartList: (list) => {
//     set({ cartList: list });
//     get().calcTotals();
//   },

//   // 가격 계산
//   calcTotals: () => {
//     const totalList = get().cartList; //매진 포함
//     const list = totalList.filter(item => item.product?.count > 0); //매진 제외

//     const total = list.reduce(
//       (acc, item) => acc + item.qty * item.product.price,
//       0
//     );

//     const dcTotal = list.reduce(
//       (acc, item) =>
//         acc + item.qty * (item.product.price * item.product.dc * 0.01),
//       0
//     );

//     set({
//       cartCount: totalList.length,
//       totalPrice: total,
//       totalDcPrice: dcTotal,
//       shippingFee: total >= 30000 ? 0 : 3000,
//     });
//   },
// }));
// store/cartStore.ts
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
