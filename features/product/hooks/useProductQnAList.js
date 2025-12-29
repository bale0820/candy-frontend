// import { api } from "@/shared/lib/axios";
// import { useQuery } from "@tanstack/react-query";

// export function useProductQnAList() {
//   return useQuery({
//     queryKey: ["productQnAList"],
//     queryFn: async () => {
//       const res = await api.get("/product/productQnAList");
//       return res.data;
//     },
//   });
// }
import { api } from "@/shared/lib/axios";
import { useQuery } from "@tanstack/react-query";

export function useProductQnAList(ppk) {
  return useQuery({
    queryKey: ["productQnAList", ppk], // ⭐ id 포함
    queryFn: async () => {
      const res = await api.get("/product/productQnAList", {
        params: { ppk },
      });
      return res.data;
    },
    enabled: !!ppk, // ⭐ id 있을 때만 실행
  });
}
