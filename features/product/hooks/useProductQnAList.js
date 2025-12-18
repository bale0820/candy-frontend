import { api } from "@/shared/lib/axios";
import { useQuery } from "@tanstack/react-query";

export function useProductQnAList() {
  return useQuery({
    queryKey: ["productQnAList"],
    queryFn: async () => {
      const res = await api.get("/product/productQnAList");
      return res.data;
    },
  });
}
