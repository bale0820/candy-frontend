"use client";

import Link from "next/link";
import { useRef, useEffect, useMemo } from "react";
import "./RecommendedSlider.scss";


import { useRecentCategoryStore } from "@/store/useRecentCategoryStore";
import { useProductList } from "@/features/product/hooks/useProductList";
import ProductCard from "@/shared/productCard/ProductCart";

export default function RecommendedSlider({ title = "추천 상품", limit = 20 }) {
  // 🔹 React Query
  const { data: productList = [] } = useProductList();

  // 🔹 Zustand로 변환된 최근 카테고리
  const recentSubCategory = useRecentCategoryStore(
    (state) => state.recentSubCategory
  );

  const sliderRef = useRef(null);

  // 🔹 필터된 추천 상품
  const filteredList = useMemo(() => {
    if (!recentSubCategory || productList.length === 0) return [];

    return productList
      .filter((item) => item.categorySub?.id === recentSubCategory)
      .slice(0, limit);
  }, [productList, recentSubCategory, limit]);

  // 🔹 자연스러운 무한 루프를 위해 리스트 확장
  const extendedList = useMemo(() => {
    if (filteredList.length === 0) return [];

    const minCount = 12;
    let arr = [...filteredList];

    while (arr.length < minCount) {
      arr = [...arr, ...filteredList];
    }

    return arr.slice(0, minCount * 2);
  }, [filteredList]);

  // 🔹 자동 스크롤 애니메이션
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let animationId;

    const scroll = () => {
      slider.scrollLeft += 0.8;

      if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth) {
        slider.scrollLeft = 0;
      }

      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationId);
  }, [extendedList]);

  if (extendedList.length === 0) return null;

  return (
    <section className="recommend-section">
      <h2 className="recommend-title">{title}</h2>

      <div className="recommend-slider" ref={sliderRef}>
        <div className="recommend-track">
          {extendedList.map((item, idx) => (
            <Link
              href={`/products/${item?.id}`}
              className="recommend-item small-card"
              key={`${item?.id}-${idx}`}
            >
              <ProductCard item={item} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
