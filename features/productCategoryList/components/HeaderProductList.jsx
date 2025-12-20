"use client";

import Link from "next/link";

import { FilterItem } from "@/shared/components/FilterItem";
import ProductCard from "@/shared/productCard/ProductCart";
import { AdvertiseList } from "@/shared/ui/advertise/AdvertiseList";
import { RightAdBanner } from "@/shared/ui/advertise/RightAdBanner";

import "./HeaderProductList.scss";
import "shared/components/filter.scss";
import { useAdvertise } from "@/shared/hooks/userAdvertise";
import { useHeaderProductList } from "@/features/productCategoryList/hooks/useHeaderProductList";

export default function HeaderProductList({ type }) {
  const { bannerAds, inlineAds } = useAdvertise();

  const {
    filteredProducts,
    loading,
    activeFilter,
    setActiveFilter,
  } = useHeaderProductList(type);

  const filterLabel = [
    { label: "최신순", value: "new" },
    { label: "높은가격순", value: "priceHigh" },
    { label: "낮은가격순", value: "priceLow" },
  ];

  return (
    <div className="new-products-page">
      <h1 className="page-title">
        {type === "best"
          ? "베스트 상품"
          : type === "sale"
          ? "세일 상품 (10% 이상)"
          : type === "deal"
          ? "특가/혜택 상품"
          : type === "time"
          ? "마감 임박 상품"
          : "신상품"}
      </h1>

      {/* 필터 UI */}
      <ul className="product-filter">
        {filterLabel.map((item) => (
          <FilterItem
            key={item.value}
            label={item.label}
            value={item.value}
            activeFilter={activeFilter}
            onClick={setActiveFilter}
          />
        ))}
      </ul>

      {/* 상품 리스트 */}
      <div className="product-list-container">
        {loading ? (
          <p className="loading">로딩 중...</p>
        ) : filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((item, idx) => (
              <Link key={idx} href={`/products/${item?.id}`}>
                <ProductCard item={item} />
              </Link>
            ))}
          </div>
        ) : (
          
          <p className="empty">상품이 없습니다.</p>
        )}
      </div>

      <li style={{ listStyle: "none" }}>
        <AdvertiseList ads={inlineAds} />
        <RightAdBanner ads={bannerAds} />
      </li>
    </div>
  );
}
