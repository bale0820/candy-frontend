  "use client";

  import { useRouter } from "next/navigation";
  import { useAuthStore } from "@/store/authStore";
  import { useEffect } from "react";
  import Link from "next/link";
  import "./AdminLayout.scss";

  export default function AdminClientLayout({ children }) {
    const router = useRouter();
    const role = useAuthStore((state) => state.role);
    const isLogin = useAuthStore((state) => state.isLogin);

    useEffect(() => {
      if (!isLogin) {
        router.replace("/login");
        return;
      }

      if (role !== "ADMIN") {
        router.replace("/");
      }
    }, [isLogin, role]);

    return (
      <div className="admin-container">
        <aside className="admin-sidebar">
          <h2 className="admin-title">관리자 메뉴</h2>

          <nav className="admin-nav">
            <Link href="/admin/analytics/forecast">📈 판매 예측</Link>
            <Link href="/admin/analytics/conversion">📊 전환율 분석</Link>
            <Link href="/admin/analytics/price">상품 가격 분석</Link>
            <Link href="/admin/products/reviewList">리뷰 분석</Link>
            <Link href="/admin/products/edit/add">상품 등록</Link>
            <Link href="/admin/products/edit">상품 편집</Link>
          </nav>
        </aside>

        <main className="admin-content">{children}</main>
      </div>
    );
  }
