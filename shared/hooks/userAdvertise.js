"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "shared/lib/axios";

export function useAdvertise() {
  return useQuery({
    queryKey: ["advertiseList"],
    queryFn: async () => {
      const res = await api.get("/advertise/list");
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
