"use client";

import { useCartStore } from "@/store/cartStore";
import { useCartQuery } from "./useCartQuery";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { parseJwt } from "@/features/auth/parseJwt";

export function useCart() {
  const router = useRouter();

  // 🔹 로그인 User ID를 초기값에서 바로 계산
  const [userId] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("auth-storage");
      if (stored) {
        const { accessToken } = JSON.parse(stored).state;
        const payload = parseJwt(accessToken);
        return payload.id;
      }
    }
    return null;
  });

  // 🔹 Zustand 상태
  const {
    cartList,
    totalPrice,
    totalDcPrice,
    shippingFee,
  } = useCartStore();

  // 🔹 React Query (userId 준비될 때만 실행됨)
  const { cartQuery, updateMutation, deleteMutation } = useCartQuery(userId);

  // 🔹 수량 감소
  const decreaseQty = (item) => {
    if (item.qty > 1) {
      updateMutation.mutate({ cid: item.cid, qty: item.qty - 1 });
    }
  };

  // 🔹 수량 증가
  const increaseQty = (item) => {
    if (item.qty < item.product.count) {
      updateMutation.mutate({ cid: item.cid, qty: item.qty + 1 });
    }
  };

  // 🔹 아이템 삭제
  const removeItem = (cid) => {
    deleteMutation.mutate({ cid });
  };

  // 🔹 주문 페이지 이동
  const goCheckout = () => {
    router.push("/checkout");
  };

  return {
    cartList,
    totalPrice,
    totalDcPrice,
    shippingFee,
    decreaseQty,
    increaseQty,
    removeItem,
    goCheckout,
  };
}
