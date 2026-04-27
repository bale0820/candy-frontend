import { API_BASE_URL_SC } from "@/shared/constants/serverEnv";

export const runtime = "nodejs";




export async function getProductList() {
  const res = await fetch(`${API_BASE_URL_SC}/product/productList`, {
    cache: "no-store",
  });
    if (!res.ok) {
    const text = await res.text(); // 🔑 핵심
    throw new Error(
      `상품 조회 실패: ${res.status}\n${text}`
    );
  }

  return res.json();
}