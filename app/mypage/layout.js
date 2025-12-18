import { parseJwt } from "features/auth/parseJwt";
import './MyPage.css'
import './AdminLayout.scss'
import Link from "next/link";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({children}) {

    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <h2 className="admin-title">마이페이지 메뉴</h2>

                <nav className="admin-nav">
                    <Link href="/mypage/userdetail">개인정보수정</Link>
                    <Link href="/mypage/myorders">주문 내역</Link>
                    <Link href="/mypage/mycoupon">쿠폰함</Link>
                
                </nav>
            </aside>

            <main className="admin-content">
                {children}
            </main>
        </div>
    );
}