
export const runtime = "nodejs";

import { API_BASE_URL } from "@/shared/constants/apiBaseUrl";

  

    export async function getProductDetail(id) {
    const res = await fetch(
        `${API_BASE_URL}/product/productDetail?id=${id}`,
        {
        cache: "no-store",
        }
    );

    if (!res.ok) {
        throw new Error(`상품 조회 실패: ${res.status}`);
    }

    return res.json();
    }
