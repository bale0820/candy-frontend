
"use client";

import { useState } from "react";
import Link from "next/link";
import "./MyPage.css";
import "@/app/admin/AdminLayout.scss";

export default function MyPageClientLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="admin-container">
      {/* ☰ 모바일 메뉴 버튼 */}
      <button
        className="admin-menu-btn"
        onClick={() => setOpen(true)}
        aria-label="마이페이지 메뉴 열기"
      >
        ☰
      </button>

      {/* 🔥 오버레이 */}
      {open && (
        <div
          className="admin-overlay"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <aside className={`admin-sidebar ${open ? "open" : ""}`}>
        <h2 className="admin-title">마이페이지 메뉴</h2>

        <nav className="admin-nav">
          <Link href="/mypage/userdetail" onClick={() => setOpen(false)}>
            개인정보수정
          </Link>
          <Link href="/mypage/myorders" onClick={() => setOpen(false)}>
            주문 내역
          </Link>
          <Link href="/mypage/mycoupon" onClick={() => setOpen(false)}>
            쿠폰함
          </Link>
        </nav>
      </aside>

      {/* 콘텐츠 */}
      <main className="admin-content">{children}</main>
    </div>
  );
}
