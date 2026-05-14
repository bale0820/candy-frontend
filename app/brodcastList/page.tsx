"use client"

import { api } from "@/shared/lib/axios";
import { useQuery } from "@tanstack/react-query";
import "./ProductBrodcastList.scss";
import Link from "next/link";
import ProductCard from "@/shared/productCard/ProductCart";
import { useRouter } from "next/navigation";

export default function brodCastLayout({ children }) {

  const router = useRouter();
  // ▶ 전체 상품 리스트 가져오기
  const { data: productList = [], isLoading: loading } = useQuery({
    queryKey: ["productList"],
    queryFn: async () => {
      const res = await api.get("/product/productList");
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });




  return (
    <div className="product-list-container">
      {loading ? (
        <p className="loading">로딩 중...</p>
      ) : productList.length > 0 ? (
        <div className="product-grid">
          {productList.map((item, idx) => (
            <div>
              <Link key={idx} href={`/products/${item?.id}`}>
                <ProductCard item={item} />
              </Link>
              <button className="b-button" onClick={() => router.push(`/products/${item.id}/lives`)} >방송보기</button>
            </div>
          ))}
        </div>
      ) : (

        <p className="empty">상품이 없습니다.</p>
      )}
    </div>

  );
}
