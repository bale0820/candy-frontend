"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/lib/axios";

export function useProductReviewList() {
  return useQuery({
    queryKey: ["productReviewList"],
    queryFn: async () => {
      const res = await api.get("/product/productReviewList");
      return res.data.map(item => ({
        ...item,
        images: typeof item.images === "string" ? JSON.parse(item.images) : item.images,
        tags: typeof item.tags === "string" ? JSON.parse(item.tags) : item.tags,
      }));
    }
  });
}
