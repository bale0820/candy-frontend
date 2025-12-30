export function isTokenExpired(token: string): boolean {
  try {
      const payload = JSON.parse(atob(token.split(".")[1]));

    // exp는 초 단위 → ms로 변환
    return payload.exp * 1000 < Date.now();
  } catch (e) {
    // 토큰 파싱 자체가 실패하면 만료로 간주
    return true;
  }
}
