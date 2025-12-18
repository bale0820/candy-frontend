"use client";

import "./AdminProductList.scss";
import "@/shared/components/filter.scss";
import { ProductFilter } from "@/features/administration/products/edit/components/ProductFilter.jsx";
import { ProductGrid } from "@/features/administration/products/edit/components/ProductGrid.jsx";
import { useAdminProducts } from "@/features/administration/products/edit/useAdminProducts.js";

export default function Page() {
  const {
    loading,
    activeFilter,
    filteredProducts,
    handleFilter,
    handleDelete,
    filterLabel
  } = useAdminProducts();

  return (
    <div className="new-products-page">
      <h1 className="page-title">상품 편집</h1>

      {/* 필터 영역 */}
      <ProductFilter
        filterLabel={filterLabel}
        activeFilter={activeFilter}
        onFilter={handleFilter}
      />

      <div className="product-list-container">
        {loading ? (
          <p className="loading">로딩 중...</p>
        ) : filteredProducts.length > 0 ? (
          <ProductGrid items={filteredProducts} onDelete={handleDelete} />
        ) : (
          <p className="empty">상품이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
