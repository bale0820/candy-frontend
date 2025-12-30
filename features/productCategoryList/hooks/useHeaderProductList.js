"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "shared/lib/axios";

import {
  sortByNew,
  sortByOld,
  sortHotOrSpecial,
  sortBySale,
  sortByPriceHigh,
  sortByPriceLow,
} from "../utils/productSortUtils";

export function useHeaderProductList(type) {
  const [activeFilter, setActiveFilter] = useState("");

  // ▶ 전체 상품 리스트 가져오기
  const { data: productList = [], isLoading: productLoading } = useQuery({
    queryKey: ["productList"],
    queryFn: async () => {
      const res = await api.get("/product/productList"); 
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  // ▶ 베스트 상품 가져오기
  const {
    data: bestProducts = [],
    isLoading: bestLoading,
  } = useQuery({
    queryKey: ["bestProducts"],
    queryFn: async () => {
      const res = await api.get("/product/productBestList");
      return res.data;
    },
    enabled: type === "best",
    staleTime: 1000 * 60 * 5,
  });

  // ▶ id에 따라 기본 필터링된 상품 계산
  const baseFiltered = useMemo(() => {
    if (type === "new") return sortByNew(productList);
    if (type === "deal") return sortHotOrSpecial(productList);
    if (type === "sale") return sortBySale(productList);
    if (type === "time") return sortByOld(productList);
    if (type === "best") return bestProducts;
    return [];
  }, [id, productList, bestProducts]);

  // ▶ 필터 버튼 클릭 시 정렬
  const filteredProducts = useMemo(() => {
    if (activeFilter === "new") return sortByNew(baseFiltered);
    if (activeFilter === "priceHigh") return sortByPriceHigh(baseFiltered);
    if (activeFilter === "priceLow") return sortByPriceLow(baseFiltered);
    return baseFiltered;
  }, [activeFilter, baseFiltered]);

  return {
    filteredProducts,
    loading: productLoading || bestLoading,
    activeFilter,
    setActiveFilter,
  };
}
