"use client";

import { LoginForm } from "@/features/login/components/LoginForm";
import { SocialLoginButtons } from "@/features/login/components/SocialLoginButtons";
import { useLogin } from "@/features/login/hooks/useLogin";
import "./login.scss";
import { useSearchParams } from "next/navigation";


export default function LoginClient() {
  const params = useSearchParams();
  const from = params.get("from") || "/";

  const {
    idRef,
    pwdRef,
    formData,
    errors,
    handleFormChange,
    handleLoginSubmit,
  } = useLogin(from);

  return (
    <div className="content">
      <div className="center-layout login-form">
        <h1 className="center-title">로그인</h1>

        <LoginForm
          formData={formData}
          errors={errors}
          idRef={idRef}
          pwdRef={pwdRef}
          onChange={handleFormChange}
          onSubmit={handleLoginSubmit}
        />

        <ul>
          <li>
            <div className="links">
              <a href="/login/find-user-id">아이디 찾기</a>
              <span>|</span>
              <a href="/login/find-password">비밀번호 찾기</a>
            </div>
          </li>

          <SocialLoginButtons />
        </ul>
      </div>
    </div>
  );
}
