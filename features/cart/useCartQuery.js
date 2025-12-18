// "use client";

// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { api } from "@/shared/lib/axios";
// import { useCartStore } from "@/store/cartStore";

// export function useCartQuery(userId) {
//   const queryClient = useQueryClient();
//   const { setCartList } = useCartStore();

//   // 🔹 장바구니 조회
//   const cartQuery = useQuery({
//     queryKey: ["cart", userId],
//     queryFn: async () => {
//       const res = await api.post("/cart/cartList", { user: { id: userId } });
//       setCartList(res.data);
//       return res.data;
//     },
//     enabled: !!userId,
//   });

//   // 🔹 장바구니 수량 업데이트
//   const updateMutation = useMutation({
//     mutationFn: ({ cid, qty }) =>
//       api.post("/cart/updateQty", { cid, qty }),

//     onSuccess: () => {
//       queryClient.invalidateQueries(["cart", userId]);
//     },
//   });

//   // 🔹 장바구니 삭제
//   const deleteMutation = useMutation({
//     mutationFn: ({ cid }) =>
//       api.post("/cart/deleteItem", { cid }),

//     onSuccess: () => {
//       queryClient.invalidateQueries(["cart", userId]);
//     },
//   });

//   return { cartQuery, updateMutation, deleteMutation };
// }
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/lib/axios";
import { useCartStore } from "@/store/cartStore";

export function useCartQuery(userId) {
  const queryClient = useQueryClient();
  const { setCartList } = useCartStore();

  // 장바구니 조회
  const cartQuery = useQuery({
    queryKey: ["cart", userId],
    queryFn: async () => {
      const res = await api.post("/cart/cartList", { user: { id: userId } });
      setCartList(res.data); // Zustand 업데이트
      return res.data;
    },
    enabled: !!userId,
  });

  // 수량 업데이트
  const updateMutation = useMutation({
    mutationFn: ({ cid, qty }) =>
      api.post("/cart/updateQty", { cid, qty }),
    onSuccess: () => {
      queryClient.invalidateQueries(["cart", userId]);
    },
  });

  // 삭제
  const deleteMutation = useMutation({
    mutationFn: ({ cid }) =>
      api.post("/cart/deleteItem", { cid }),
    onSuccess: () => {
      queryClient.invalidateQueries(["cart", userId]);
    },
  });

  return { cartQuery, updateMutation, deleteMutation };
}
