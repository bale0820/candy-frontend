"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/lib/axios";
import { useOrdersStore } from "@/store/orderStore";

export function useMyOrdersQuery(userId) {
    const queryClient = useQueryClient();
    const { setOrders } = useOrdersStore();

    // 결제내역 조회
    const ordersQuery = useQuery({
        queryKey: ["orders", userId],
        queryFn: async () => {
            const res = await api.get(`/orders/my/${userId}`);
            setOrders(res.data); // Zustand 업데이트
            return res.data;
        },
        enabled: !!userId,
    });

    // 삭제
    const deleteMutation = useMutation({
        mutationFn: ({ userId, orderCode }) =>
            api.delete(`/orders/deleteOrder/${userId}/${orderCode}`),
        onSuccess: () => {
            queryClient.invalidateQueries(["orders", userId]);
        },
    });


    return { ordersQuery, deleteMutation };
}
