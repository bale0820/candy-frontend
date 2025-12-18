"use client";

import React from "react";
import Link from "next/link";
import { FiMenu } from "react-icons/fi";
import "./CategoryNav.scss";
import { CategoryMenu } from "@/features/category/components/CategoryMenu.jsx";

export default function CategoryNav() {
  return (
    <nav className="category-nav">
      <ul className="category-nav__list">
        {/* 카테고리 전체 메뉴 */}
        <li className="category-first">
          <FiMenu />
          <span>카테고리</span>
          <CategoryMenu />
        </li>

        {/* 상단 네비 메뉴 */}
        <li>
          <ul>
            <li><Link href="/productList/new">신상품</Link></li>
            <li><Link href="/productList/best">베스트</Link></li>
            <li><Link href="/productList/sale">알뜰쇼핑</Link></li>
            <li><Link href="/productList/deal">특가/혜택</Link></li>
            <li><Link href="/recipe">레시피</Link></li>
          </ul>
        </li>

        <li className="category-last">
          <Link href="/delivery">샛별/하루 배송안내</Link>
        </li>
      </ul>
    </nav>
  );
}
