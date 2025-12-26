import Header from "@/layout/header/Header";
import Footer from "@/layout/Footer/Footer";
import FloatingChatBot from "@/layout/floating/FloatingChatBot";
import "./globals.css";

import { Providers } from "./providers";

// 📌 Next.js App Router 기준 전역 메타데이터
export const metadata = {
  title: {
    default: "Candy Market",
    template: "%s | Candy Market",
  },
  description: "Next.js Shopping Mall",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {/* ✅ 전역 상태 / 인증 / React Query Provider */}
        <Providers>
          <div className="layout">
            <main className="main container">
              {/* ✅ 모든 페이지에서 공통으로 사용하는 헤더 */}
              <Header />

              {/* ✅ 각 route(page.tsx)의 실제 콘텐츠 */}
              {children}
            </main>

            {/* ✅ 전역 Footer */}
            <Footer />

            {/* ✅ 페이지 이동과 무관하게 유지되는 플로팅 UI */}
            <FloatingChatBot />
          </div>
        </Providers>
      </body>
    </html>
  );
}
