"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/lib/axios";

export function useProductList(options = {}) {
  return useQuery({
    queryKey: ["productList"],
    queryFn: async () => {
      const res = await api.get("/product/productList");
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}