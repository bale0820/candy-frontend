"use client";

export function TopProducts({ top }) {
  return (
    <div className="top-products-box">
      <h3>🔥 리뷰 많은 인기 상품 TOP 5</h3>
      <ul>
        {top.map((p) => (
          <li key={p.ppk}>
            {p.productName} <span>({p.count})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
