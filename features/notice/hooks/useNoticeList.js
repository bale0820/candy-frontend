"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/lib/axios";

export function useNoticeList() {
  return useQuery({
    queryKey: ["noticeList"],
    queryFn: async () => {
      const res = await api.get("/notice/all");
      return res.data; // 그대로 배열 반환
    },
  });
}
