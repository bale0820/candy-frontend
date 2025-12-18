"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoCartOutline } from "react-icons/io5";
import "./LogoSearch.scss";

// Zustand Store import
import { useCartStore } from "@/store/cartStore";

export default function LogoSearch() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  // 장바구니 카운트 (Zustand)
    const cartCount = useCartStore((state) => state.cartCount);

  // 검색 실행
  const handleSearch = () => {
    if (keyword.trim() !== "") {
      router.push(`/search/keyword/${encodeURIComponent(keyword)}`);
    }
  };

  // Enter 검색
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="middle-search">
      <div className="middle-search__bar">
        <input
          type="text"
          className="middle-search__bar__input"
          placeholder="상품명을 입력하세요..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="middle-search__bar__btn" onClick={handleSearch}>
          검색
        </button>
      </div>

      <div className="etc">
        <span className="etc__cart-link">
          <Link href="/cart">
            <IoCartOutline />
          </Link>
          <span className="etc__cart-count">{cartCount}</span>
        </span>
      </div>
    </div>
  );
}
