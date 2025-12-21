import { Suspense } from "react";
import OAuthSuccessPage from "./OAuthSuccessPage";


export default function Page() {
  return (
    <Suspense fallback={<div>로그인 처리 중...</div>}>
      <OAuthSuccessPage />
    </Suspense>
  );
}
