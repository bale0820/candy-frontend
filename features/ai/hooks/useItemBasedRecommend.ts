import { api } from "@/shared/lib/axios";
import { useQuery } from "@tanstack/react-query";


export function useItemBasedRecommend(
  productId: number
) {

  return useQuery({

    queryKey: [
      "item-based",
      productId
    ],

    queryFn: async () => {

      const response = await api.get(
        `/ai/item-based/${productId}`
      );

      return response.data;
    },

    enabled: !!productId

  });

}