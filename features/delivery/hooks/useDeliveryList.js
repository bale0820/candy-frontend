"use client";

import {useQuery} from "@tanstack/react-query";
import {api} from "@/shared/lib/axios";

export function useDeliveryList() {
  return useQuery({
    queryKey: ["deliveryList"],
      queryFn: async () => {
          const res = await api.get("/delivery/deliveryList");
          return res.data;
      },
  });
}
