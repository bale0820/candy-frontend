
"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import Link from "next/link";
import "./AdminLayout.scss";

export default function AdminClientLayout({ children }) {
  const router = useRouter();
const {isLogin, _hasHydrated, role} = useAuthStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if(_hasHydrated) {
      if (!isLogin) {
        router.replace("/login");
        return;
      }
      if (role !== "ADMIN") {
        router.replace("/");
      }
    }

  }, [isLogin, role, _hasHydrated]);

  return (
    <div className="admin-container">
      {/* ☰ 모바일 메뉴 버튼 */}
      <button className="admin-menu-btn" onClick={() => setOpen(true)}>
        ☰
      </button>

      {/* 🔥 오버레이 (바깥 클릭 감지용) */}
      {open && <div className="admin-overlay" onClick={() => setOpen(false)} />}

      {/* 사이드바 */}
      <aside className={`admin-sidebar ${open ? "open" : ""}`}>
        <h2 className="admin-title">관리자 메뉴</h2>

        <nav className="admin-nav">
          <Link href="/admin/analytics/forecast" onClick={() => setOpen(false)}>
            📈 판매 예측
          </Link>
          <Link
            href="/admin/analytics/conversion"
            onClick={() => setOpen(false)}
          >
            📊 전환율 분석
          </Link>
          <Link href="/admin/analytics/price" onClick={() => setOpen(false)}>
            💰 상품 가격 분석
          </Link>
          <Link href="/admin/products/reviewList" onClick={() => setOpen(false)}>
            📝 리뷰 분석
          </Link>
          <Link
            href="/admin/products/edit/add"
            onClick={() => setOpen(false)}
          >
            ➕ 상품 등록
          </Link>
          <Link href="/admin/products/edit" onClick={() => setOpen(false)}>
            ✏️ 상품 편집
          </Link>
        </nav>
      </aside>

      {/* 콘텐츠 */}
      <main className="admin-content">{children}</main>
    </div>
  );
}
