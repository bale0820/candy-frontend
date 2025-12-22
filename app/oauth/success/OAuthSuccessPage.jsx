"use client";
export const dynamic = "force-dynamic";


import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/shared/lib/axios";

export default function OAuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 상태 저장 함수
  const socialLogin = useAuthStore((state) => state.login);

  const accessToken = searchParams.get("accessToken");
  const provider = searchParams.get("provider");
  const userId = searchParams.get("userId");
  const success = searchParams.get("success");

 useEffect(() => {
  if (success !== "200") return;

  if (accessToken && userId && provider) {
    // 1️⃣ 로그인 정보 저장
    socialLogin({
      provider,
      userId,
      accessToken,
    });

    // 2️⃣ 소셜 쿠키 발급 요청 (에러는 잡아서 무시)
    (async () => {
      try {
        await api.post(
          "/auth/social-cookie",
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } catch (err) {
        console.error("❌ social-cookie 실패 (페이지는 계속 진행)", err);
      }
    })();
  }

  // 3️⃣ 메인 페이지 이동
  const timer = setTimeout(() => {
    router.replace("/");
  }, 2000);

  return () => clearTimeout(timer);
}, [success, accessToken, provider, userId, router, socialLogin]);


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
