"use client";

import ProductCard from "@/shared/productCard/ProductCart.jsx";
import { useProductStore } from "@/store/proudctStore";
import { useRouter } from "next/navigation";

export function ProductGrid({ items, onDelete }) {
    const setItem = useProductStore((state) => state.setItem);
    const router = useRouter();

    const goUpdatePage = (item) => {
        setItem(item);
        router.push("/admin/products/edit/update");
    }

    return (
    <div className="product-grid">
      {items.map((item, idx) => (
        <div key={idx}>
          <div onClick={() => goUpdatePage(item)}>
            <ProductCard item={item} />
            <button type="button" className="update-btn">편집</button>
          </div>

          <button
            type="button"
            className="delete-btn"
            onClick={() => onDelete(item?.id)}
          >
            삭제
          </button>
        </div>
      ))}
    </div>
  );
}
