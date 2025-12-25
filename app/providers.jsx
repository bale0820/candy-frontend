// "use client";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { useState, useEffect } from "react";
// import { setupApiInterceptors } from "@/shared/lib/axios"; // ← 추가

// export function Providers({ children }) {
//   const [client] = useState(() => new QueryClient());

//   // ⭐ 앱이 클라이언트에서 처음 로드될 때 한 번만 인터셉터 등록
//   useEffect(() => {
//     setupApiInterceptors();
//   }, []);

//   return (
//     <QueryClientProvider client={client}>
//       {children}
//     </QueryClientProvider>
//   );
// }
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { setupApiInterceptors } from "@/shared/lib/axios";
import AuthInit from "./AuthInit";

export function Providers({ children }) {
  const [client] = useState(() => new QueryClient());

  // ⭐ axios 인터셉터는 앱 시작 시 1회
  useEffect(() => {
    setupApiInterceptors();
  }, []);

  return (
    <QueryClientProvider client={client}>
      <AuthInit /> {/* ✅ 인증 초기화 */}
      {children}
    </QueryClientProvider>
  );
}
