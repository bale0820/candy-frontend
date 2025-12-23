"use client";

import Swal from "sweetalert2";
import { useMemo, useState } from "react";
import { parseJwt } from "features/auth/parseJwt";
import { useAdminProductsQuery } from "@/features/administration/products/edit/useAdminProductsQuery";

export function useAdminProducts() {
  const { productListQuery, productDelete } = useAdminProductsQuery();
  const { data: productList, isLoading } = productListQuery;

  const [activeFilter, setActiveFilter] = useState("");

  // ✅ userId는 "상태"가 아니라 "계산값"
  const userId = useMemo(() => {
    if (typeof window === "undefined") return null;

    const loginInfo = localStorage.getItem("auth-storage");
    if (!loginInfo) return null;

    try {
      const { accessToken } = JSON.parse(loginInfo).state;
      const payload = parseJwt(accessToken);
      return payload?.id ?? null;
    } catch {
      return null;
    }
  }, []);

  // ✅ 1차 필터: 내 상품만
  const myProducts = useMemo(() => {
    if (!productList || !userId) return [];
    return productList.filter((p) => p?.user?.id === userId);
  }, [productList, userId]);

  // ✅ 2차 필터 + 정렬
  const filteredProducts = useMemo(() => {
    const sorted = [...myProducts];

    if (activeFilter === "new") {
      sorted.sort(
        (a, b) => new Date(b.productDate) - new Date(a.productDate)
      );
    } else if (activeFilter === "priceHigh") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (activeFilter === "priceLow") {
      sorted.sort((a, b) => a.price - b.price);
    }

    return sorted;
  }, [myProducts, activeFilter]);

  // ✅ loading은 계산값 (setState ❌)
  const loading = isLoading || !userId;

  const handleFilter = (type) => {
    setActiveFilter(type);
  };

  const handleDelete = async (productId) => {
    const result = await Swal.fire({
      icon: "warning",
      text: "상품을 정말 삭제 하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    });

    if (!result.isConfirmed) return;

    try {
      await productDelete.mutateAsync({ productId });
      Swal.fire("삭제 완료", "상품이 삭제되었습니다.", "success");
    } catch {
      Swal.fire("실패", "다시 시도해주세요.", "error");
    }
  };

  return {
    loading,
    activeFilter,
    filteredProducts,
    handleFilter,
    handleDelete,
    filterLabel: [
      { label: "최신순", value: "new" },
      { label: "높은가격순", value: "priceHigh" },
      { label: "낮은가격순", value: "priceLow" },
    ],
  };
}
