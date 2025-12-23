
import Header from "@/layout/header/Header";
import "./globals.css";
import { Providers } from "./providers";
import Footer from "@/layout/Footer/Footer";
import FloatingChatBot from "@/layout/floating/FloatingChatBot";
import { CartInitializer } from "@/features/CartInitializer/CartInitializer";
import { SlideContainer } from "@/shared/ui/slider/SlideContainer";

// 컴포넌트 import (Next.js에서는 절대경로 alias 추천)


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
        <Providers>
          <div className="layout">
            <main className="main container">
              <Header />
              <CartInitializer />
              {children}
            </main>
            <Footer />
            <FloatingChatBot />
          </div>
        </Providers>
      </body>
    </html>
  );
}
