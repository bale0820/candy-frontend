import ProductCard from "@/shared/productCard/ProductCart.jsx";
import Link from "next/link";
import "@/app/search/SearchResult.scss";

export function SearchResultList({ filterList }) {
  if (!filterList || filterList.length === 0)
    return <p>검색 결과가 없습니다.</p>;

  return (
    <div className="product-grid">
      {filterList.map((item, idx) => (
        <Link
          href={`/products/${encodeURIComponent(item.id)}`}
          key={idx}
        >
          <ProductCard item={item} />
        </Link>
      ))}
    </div>
  );
}
