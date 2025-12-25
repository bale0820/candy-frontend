import React from "react";
import Link from "next/link";
import { IMAGE_BASE_URL } from "@/shared/constants/clientEnv";

export function RelatedProductList({ relatedProducts }) {
  if (!relatedProducts?.length) return null;

  return (
    <>
      <h2 className="section-title">레시피에 필요한 상품</h2>

      <div className="related-product-list">
        {relatedProducts?.map((p) => (
          <Link href={`/products/${p?.id}`} key={p?.id}>
            <div className="related-product-card">
              <img src={`${IMAGE_BASE_URL}/data/productImages/${p.imageUrl}`} alt={p.productName} />
              <div className="product-name">{p.productName}</div>
              <div className="product-price">{p.price.toLocaleString()}원</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
