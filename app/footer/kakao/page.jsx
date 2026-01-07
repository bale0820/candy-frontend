// app/kakao/page.tsx
export default function KakaoPage() {
  return (
    <main style={{ padding: "40px", textAlign: "center" }}>
      <h1>카카오톡 채널</h1>
      <p>카카오톡에서 KAFB2B 채널을 추가해 주세요.</p>

      <a
        href="https://open.kakao.com/o/gUagrUUh"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          marginTop: "20px",
          padding: "12px 20px",
          background: "#FEE500",
          color: "#000",
          borderRadius: "6px",
          fontWeight: "bold"
        }}
      >
        카카오톡 채널 바로가기
      </a>
    </main>
  );
}