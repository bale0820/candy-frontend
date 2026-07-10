import { useState, useEffect } from "react";
import { useProductList } from "@/features/product/hooks/useProductList";
import { useCategoryList } from "@/features/category/hooks/useCategoryList";

export function useSearchResult({ mode, keyword, cateId }) {

    // 🔹 React Query 로 상품 목록 가져오기
    const { data: productList = [], isLoading, isError } = useProductList();
    const { data: categoryList } = useCategoryList();

    const [filterList, setFilterList] = useState([]);
    const [activeFilter, setActiveFilter] = useState("");

    // 검색 필터
    function searchFiltering(keyword) {
        return productList.filter((p) =>
            p?.description.toLowerCase().includes(keyword.toLowerCase()) ||
            p?.productName.toLowerCase().includes(keyword.toLowerCase()) ||
            p.brandName.toLowerCase().includes(keyword.toLowerCase())
        );
    }

    // 브랜드 필터
    function brandFiltering(keyword) {
        return productList.filter((p) => p?.brandName === keyword);
    }
    // 카테고리 필터
    function categoryFiltering(mode, cateId) {
        let filtered = [];
        // 대분류
        if (mode === "main") {
            const category = categoryList.find(
                (c) => c?.id === cateId
            );

            filtered = productList.filter((p) =>
                category.subCategories.some((sub) => sub?.id === p.categorySub?.id)
            );
        }
        // 중분류
        else {
            filtered = productList.filter(
                (p) => p.categorySub?.id === cateId
            );
        }

        return filtered
    }

    // 🔍 검색/브랜드/카테고리 선택에 따른 필터링
    useEffect(() => {
        let filtered = [];

        switch (mode) {
            case "search":
                filtered = searchFiltering(keyword);
                break;

            case "brand":
                filtered = brandFiltering(keyword);
                break;

            case "main":
            case "sub":
                filtered = categoryFiltering(mode, cateId);
                break;

            default:
                filtered = [];
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFilterList(filtered);
        setActiveFilter("");
    }, [mode, keyword, cateId]);

    // 🔍 필터 UI 클릭 처리
    const handleFilter = (type) => {
        let filtered = [];

        setActiveFilter(type);

        if (type === "new") {
          filtered = [...filterList].sort(
            (a, b) => new Date(b.productDate) - new Date(a.productDate)
          );
        } else if (type === "priceHigh") {
          filtered = [...filterList].sort((a, b) => b.price - a.price);
        } else if (type === "priceLow") {
          filtered = [...filterList].sort((a, b) => a.price - b.price);
        }

        setFilterList(filtered);
    };

    return { filterList, activeFilter, handleFilter };
}
