"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/lib/axios";

export function useAdminProductsQuery(id, productJson, files) {
    const queryClient = useQueryClient();

    // 상품 조회
    const productListQuery = useQuery({
        queryKey: ["adminProductList"],
        queryFn: async () => {
            const res = await api.get("/product/productList");
            return res.data;
        }
    });

    // 상품 삭제
    const productDelete = useMutation({
        mutationFn: async ({ productId }) => {
            await api.get("/product/productDelete",{ params: { "id":productId } });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["adminProductList"]);
        }
    });

    // 상품 등록
    const productAdd = useMutation({
        mutationFn: async (data) => {
            await api.post("https://candy-api.duckdns.org/product/productAdd", data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["adminProductList"]);
        }
    });

    // 상품 편집
    const productUpdate = useMutation({
        mutationFn: async (data) => {
            await api.post("https://candy-api.duckdns.org/product/productUpdate", data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["adminProductList"]);
    }
});

    return { productListQuery, productDelete, productAdd, productUpdate };
}