"use client";

import Swal from "sweetalert2";
import { useState, useEffect, useMemo } from "react";
import { parseJwt } from "features/auth/parseJwt";
import { useAdminProductsQuery } from "@/features/administration/products/edit/useAdminProductsQuery";

export function useAdminProducts() {

    const { productListQuery, productDelete}= useAdminProductsQuery();

    const [filteredProducts, setFilteredProducts] = useState([]);
    const [activeFilter, setActiveFilter] = useState("");
    const [loading, setLoading] = useState(true);

    const { data: productList } = productListQuery;

    // 로그인한 유저 상품만 필터링
    const updateProducts = useMemo(() => {
        const loginInfo = localStorage.getItem("auth-storage");

        if (!loginInfo) return [];

        const { accessToken } = JSON.parse(loginInfo).state;
        const payload = parseJwt(accessToken);
        const upk = payload.id;

        if (!productList || productList.length === 0) return [];

        // eslint-disable-next-line react-hooks/set-state-in-render
        setLoading(false);

        return productList.filter((p) => p.user.id === upk);
    }, [productList]);

    useEffect(() => {
        setFilteredProducts(updateProducts);
    }, [updateProducts]);

    // 필터 클릭 로직
    const handleFilter = (type) => {
        setActiveFilter(type);

        let sorted = [];

        if (type === "new") {
          sorted = updateProducts.toSorted(
            (a, b) => new Date(b.productDate) - new Date(a.productDate)
          );
        } else if (type === "priceHigh") {
          sorted = updateProducts.toSorted((a, b) => b.price - a.price);
        } else if (type === "priceLow") {
          sorted = updateProducts.toSorted((a, b) => a.price - b.price);
        }

        setFilteredProducts(sorted);
    };

    // 삭제 로직
    const handleDelete = async (productId) => {
        const result = await Swal.fire({
            icon: "warning",
            text: "상품을 정말 삭제 하시겠습니까?",
            showCancelButton: true,
            confirmButtonText: "삭제",
            cancelButtonText: "취소",
        });

        if (!result.isConfirmed) return;

        try {
            await productDelete.mutateAsync({ productId });

            Swal.fire({
                icon: "success",
                title: "상품 삭제 성공!",
                text: "상품이 성공적으로 삭제되었습니다.",
            });
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "삭제 실패",
                text: "다시 시도해주세요.",
            });
        }
    };

    return {
        loading,
        activeFilter,
        filteredProducts,
        handleFilter,
        handleDelete,
        filterLabel: [
          { label: "최신순", value: "new" },
          { label: "높은가격순", value: "priceHigh" },
          { label: "낮은가격순", value: "priceLow" },
        ],
    };
}
