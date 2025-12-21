import LoginClient from "./LoginClient";
import { Suspense } from "react";
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <Suspense fallback={<div>로딩 중...</div>}>
          <LoginClient />
          </Suspense>;
}
