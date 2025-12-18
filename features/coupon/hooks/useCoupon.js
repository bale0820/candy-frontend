"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Swal from "sweetalert2";
import { parseJwt } from "@/features/auth/parseJwt";
import { couponAPI } from "../api/couponAPI";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useCoupon() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const [userId, setUserId] = useState(null);

  // 🔹 로그인한 사용자 토큰에서 userId 추출
  useEffect(() => {
    const stored = localStorage.getItem("auth-storage");
    if (stored) {
      const { accessToken } = JSON.parse(stored).state;
      const payload = parseJwt(accessToken);
      setUserId(payload.id);
    }
  }, []);

  // 🔹 전체 쿠폰 조회 (TanStack Query)
  const { data: couponList = [] } = useQuery({
    queryKey: ["couponList"],
    queryFn: async () => {
      const res = await couponAPI.getCouponList();
      return res.data;
    },
  });

  // 🔹 발급된 쿠폰 조회 (사용자 로그인 후만 실행)
  const { data: issuedCoupons = [] } = useQuery({
    queryKey: ["issuedCoupons", userId],
    queryFn: async () => {
      const stored = localStorage.getItem("auth-storage");
      const { accessToken } = JSON.parse(stored).state;
      const res = await couponAPI.getIssuedCoupons(userId, accessToken);
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: !!userId, // userId 있을 때만 실행
  });

  // 🔹 쿠폰 발급 Mutation
  const issueMutation = useMutation({
    mutationFn: async (couponId) => {
      const stored = localStorage.getItem("auth-storage");
      const { accessToken } = JSON.parse(stored).state;
      return await couponAPI.issueCoupon(couponId, userId, accessToken);
    },
    onSuccess: (res, couponId) => {
      if (res.data.status === "success") {
        Swal.fire({
          icon: "success",
          title: "쿠폰 발급 완료!",
        });

        // issuedCoupons를 다시 불러오도록 캐시 업데이트
        queryClient.invalidateQueries(["issuedCoupons", userId]);
      } else {
        Swal.fire({
          icon: "warning",
          title: res.data.message || "이미 발급된 쿠폰입니다",
        });
      }
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "쿠폰 발급 실패",
      });
    },
  });

  // 🔹 쿠폰 발급 함수
  const issueCoupon = async (couponId) => {
    if (!userId) {
      return Swal.fire({
        icon: "warning",
        title: "로그인이 필요합니다",
      }).then(() => {
        router.push(`/login?from=${pathname}`);
      });
    }

    if (issuedCoupons.includes(couponId)) {
      return Swal.fire({
        icon: "warning",
        title: "이미 발급된 쿠폰입니다",
      });
    }

    issueMutation.mutate(couponId);
  };

  return {
    userId,
    couponList,
    issuedCoupons,
    issueCoupon,
  };
}
