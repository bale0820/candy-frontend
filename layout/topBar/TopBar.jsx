"use client";

import Link from "next/link";
import { LuCandy } from "react-icons/lu";
import { useRouter } from "next/navigation";
import "./TopBar.scss";
import { api } from "@/shared/lib/axios";
import { useAuthStore } from "@/store/authStore";

export default function TopBar() {
  const router = useRouter();

  const { isLogin, role, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout",{});
      // localStorage.removeItem("");
      logout(); // Zustand 상태 변경
      router.push("/");
    } catch (err) {
      console.log("로그아웃 실패:", err);
    }
  };

  
  return (
    <div className="top-bar">
      <div className="top-bar__left">
        <Link href="/" className="logo">
          <LuCandy /> Candy
        </Link>
      </div>

      <div className="top-bar__right">
        <ul className="top-bar__menu">
          <li><Link href="/support">고객센터</Link></li>
          <li><Link href="/notice">공지사항</Link></li>

          {!isLogin && <li><Link href="/signup">회원가입</Link></li>}
          {!isLogin && <li><Link href="/login">로그인</Link></li>}

          {isLogin && <li onClick={handleLogout}>로그아웃</li>}
          {isLogin && <li><Link href="/mypage">마이페이지</Link></li>}

          {isLogin && role == "ADMIN" && (
            <li><Link href="/admin">관리자페이지</Link></li>
          )}
        </ul>
      </div>
    </div>
  );
}
