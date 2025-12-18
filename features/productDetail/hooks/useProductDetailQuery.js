"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/lib/axios";

export function useProductDetailQuery(id) {
  return useQuery({
    queryKey: ["productDetail", id],
    queryFn: async () => {
      const res = await api.get("/product/productDetail", { params: { id } });
      return res.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 3, // 3분 캐싱
  });
}
