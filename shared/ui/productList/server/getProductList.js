import { API_BASE_URL } from "@/shared/constants/dataBaseUrl";

export async function getProductList() {
  const res = await fetch(`${API_BASE_URL}/product/productList`, {
    cache: "no-store",
  });

  return res.json();
}