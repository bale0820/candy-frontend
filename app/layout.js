import Header from "@/layout/header/Header";
import Footer from "@/layout/Footer/Footer";
import FloatingChatBot from "@/layout/floating/FloatingChatBot";
import "./globals.css";

import { Providers } from "./providers";

// 📌 Next.js App Router 기준 전역 메타데이터
export const metadata = {
  metadataBase: new URL("https://candy-frontend-taupe.vercel.app"),
  title: {
    default: "Candy Market",
    template: "%s | Candy Market",
  },
  applicationName: "Candy Market",
  description: "원딜핫딜, 멤버특가 등 실시간 인기 상품을 가장 빠르게 만나보세요.",
  verification: {
    google: "359In8q40-mtbh78wCDQZ_YHIoDJAbisN-1e72YfYK0", // 👈 여기 붙여넣기
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Candy Market",
              alternateName: "Candy-market",
              url: "https://candy-frontend-taupe.vercel.app",
            }),
          }}
        />
      </head>
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
