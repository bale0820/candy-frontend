import { API_BASE_URL_SC } from "@/shared/constants/serverEnv";

export const runtime = "nodejs";




export async function getProductList() {
  const res = await fetch(`${API_BASE_URL_SC}/product/productList`, {
    cache: "no-store",
  });

  return res.json();
}