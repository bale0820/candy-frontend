
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/lib/axios";
import { useCartStore } from "@/store/cartStore";

type UpdateQtyPayload = {
  cid: number;
  qty: number;
};

type DeleteItemPayload = {
  cid: number;
};

export function useCartQuery(userId: number | null, enabled = true) {
  const queryClient = useQueryClient();
  const { setCartList } = useCartStore();

  // 장바구니 조회
  const cartQuery = useQuery({
    queryKey: ["cart", userId],
    queryFn: async () => {
      const res = await api.post("/cart/cartList", {
        user: { id: userId },
      });
      setCartList(res.data);
      return res.data;
    },
    enabled: enabled && !!userId,
  });

  // 수량 변경
  const updateMutation = useMutation<void, Error, UpdateQtyPayload>({
    mutationFn: ({ cid, qty }) =>
      api.post("/cart/updateQty", { cid, qty }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart", userId],
      });
    },
  });

  // 삭제
  const deleteMutation = useMutation<void, Error, DeleteItemPayload>({
    mutationFn: ({ cid }) =>
      api.post("/cart/deleteItem", { cid }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart", userId],
      });
    },
  });

  return {
    cartQuery,
    updateMutation,
    deleteMutation,
  };
}
