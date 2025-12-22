"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/lib/axios";
import { PRODUCT_API_BASE_URL } from "@/shared/constants/clientEnv";

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
            await api.get(`${PRODUCT_API_BASE_URL}/product/productDelete`,{ params: { "id":productId } });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["adminProductList"]);
        }
    });

    // 상품 등록
    const productAdd = useMutation({
        mutationFn: async (data) => {
            await api.post(`${PRODUCT_API_BASE_URL}/product/productAdd`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["adminProductList"]);
        }
    });

    // 상품 편집
    const productUpdate = useMutation({
        mutationFn: async (data) => {
            await api.post(`${PRODUCT_API_BASE_URL}/product/productUpdate`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["adminProductList"]);
    }
});

    return { productListQuery, productDelete, productAdd, productUpdate };
}