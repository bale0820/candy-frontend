"use client";

import { useAuthStore } from "@/store/authStore";
import { useCartQuery } from "@/features/cart/useCartQuery";

export function CartInitializer() {
  const userId = useAuthStore((state) => state.userId);

  useCartQuery(userId); // 장바구니 항상 최신 유지

  return null; // UI 출력 없음
}
