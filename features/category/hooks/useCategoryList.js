"use client";

import {useQuery} from "@tanstack/react-query";
import {api} from "@/shared/lib/axios";

export function useCategoryList() {
  return useQuery({
    queryKey: ["categoryList"],
      queryFn: async () => {
          const res = await api.get("/category/list");
          return res.data;
      },
  });
}
