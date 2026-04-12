// app/AuthInit.tsx
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { isTokenExpired } from "@/utils/isTokenExpired";
import { useInitCart } from "@/features/cart/hooks/useInitCart";

export default function AuthInit() {
  const {
    accessToken,
    userId,
    logout,
    _hasHydrated,
  } = useAuthStore();
  
  const clearCart = useCartStore((s) => s.clearCart);

  // ✅ 카트 실행 조건
  const canInitCart =
    _hasHydrated &&
    !!accessToken &&
    !isTokenExpired(accessToken);

  // ⭐ 항상 호출 (조건 X)
  useInitCart(userId, canInitCart);

  // 🔥 토큰 만료 / 로그아웃 처리
  useEffect(() => {
    if (!_hasHydrated) return;

    if (!accessToken || isTokenExpired(accessToken)) {
      logout();
      clearCart();
    }
  }, [_hasHydrated, accessToken]);

  return null;
}
