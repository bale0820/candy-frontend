"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function OAuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 상태 저장 함수
  const socialLogin = useAuthStore((state) => state.socialLogin);

  const accessToken = searchParams.get("accessToken");
  const provider = searchParams.get("provider");
  const userId = searchParams.get("userId");
  const success = searchParams.get("success");

  useEffect(() => {
    if (success !== "200") return;

    // 1️⃣ 로그인 성공 → localStorage(또는 indexedDB)에 저장(Zustand persist)
    if (accessToken && userId && provider) {
      socialLogin({
        provider,
        userId,
        accessToken,
      });
    }

    // 2️⃣ 2초 뒤 메인 페이지로 이동
    const timer = setTimeout(() => {
      router.replace("/");
    }, 2000);

    return () => clearTimeout(timer);
  }, [success, accessToken, provider, userId ,router, socialLogin]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      {success === "200" ? (
        <p>로그인 완료! 잠시 후 메인 페이지로 이동합니다...</p>
      ) : (
        <p>로그인 중 오류가 발생했습니다. 다시 시도해주세요.</p>
      )}
    </div>
  );
}
