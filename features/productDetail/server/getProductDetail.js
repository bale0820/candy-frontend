import { API_BASE_URL_SC } from "@/shared/constants/serverEnv";

export const runtime = "nodejs";



  

    export async function getProductDetail(id) {
    const res = await fetch(
        `${API_BASE_URL_SC}/product/productDetail?id=${id}`,
        {
        cache: "no-store",
        }
    );
   
    if (!res.ok) {
        throw new Error(`상품 조회 실패: ${res.status}`);
    }

    return res.json();
    }
