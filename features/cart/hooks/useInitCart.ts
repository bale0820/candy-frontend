// features/cart/hooks/useInitCart.ts
"use client";

import { useCartQuery } from "@/features/cart/useCartQuery";

export function useInitCart(
  userId: number | null,
  enabled: boolean
) {
  // ⭐ 두 번째 인자는 boolean 그대로
  useCartQuery(userId, enabled);
}
