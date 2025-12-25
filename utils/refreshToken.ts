import { api } from "@/shared/lib/axios";

export async function refreshToken(): Promise<string> {
  const response = await api.post(
    `/auth/refresh`,
    {},
  );

  // 서버에서 새 accessToken 내려주는 구조
  return response.data.accessToken;
}
