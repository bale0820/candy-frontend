// src/features/auth/components/SocialLoginButtons.jsx
export function SocialLoginButtons() {
  const handleNaverLogin = () =>
    (window.location.href = `${API_BASE_URL}/oauth2/authorization/naver`);

  const handleKakaoLogin = () =>
    (window.location.href = `${API_BASE_URL}/oauth2/authorization/kakao`);

  return (
    <>
      <li>
        <button className="btn-main-color-naver" onClick={handleNaverLogin}>
          네이버 로그인
        </button>
      </li>

      <li>
        <button
          onClick={handleKakaoLogin}
          className="btn-main-color-naver"
          style={{ backgroundColor: "#FEE500", color: "#000" }}
        >
          카카오로 로그인
        </button>
      </li>
    </>
  );
}
