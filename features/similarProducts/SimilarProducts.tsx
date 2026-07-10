"use client";

import Link from "next/link";
import { useMemo } from "react";

import "./SimilarProducts.scss";

import ProductCard from "@/shared/productCard/ProductCart";

import { useProductList }
from "@/features/product/hooks/useProductList";
import { useItemBasedRecommend } from "../ai/hooks/useItemBasedRecommend";




interface Props {
  productId: number;
}

export default function SimilarProducts({
  productId
}: Props) {

  // 전체 상품
  const {
    data: productList = []
  } = useProductList();

  // AI 추천 결과
  const {
    data: recommendData = {
      similar_products: []
    }
  } = useItemBasedRecommend(productId);
  console.log(recommendData);

  // 추천 상품만 추출
  const filteredList = useMemo(() => {

    if (
      !recommendData?.similar_products?.length
    ) {
      return [];
    }

    const productSet = new Set(
      recommendData.similar_products
    );


    return productList.filter(
      (item) => productSet.has(item.id)
    );

  }, [productList, recommendData]);

  console.log(filteredList);

  // 추천 없으면 숨김
  if (filteredList.length === 0) {
    return null;
  }

  return (
    <section className="similar-products">

      <h2 className="similar-title">
        이런 상품 어떠세요?
      </h2>

      <div className="similar-grid">

        {filteredList.map((item) => (

          <Link
            key={item.id}
            href={`/products/${item.id}`}
            className="similar-item"
          >
            <ProductCard item={item} />
          </Link>

        ))}

      </div>

    </section>
  );
}