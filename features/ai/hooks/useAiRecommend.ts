import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/lib/axios";

export function useAiRecommend(
  userId?: number
) {

  return useQuery({

    queryKey: [
      "aiRecommend",
      userId
    ],

    queryFn: async () => {

      const res =
        await api.get(
          `/ai/recommend/${userId}`
        );
      return res.data;
    },

    enabled: !!userId

  });

}