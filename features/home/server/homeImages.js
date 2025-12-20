// import { IMAGE_BASE_URL_SC } from "@/shared/constants/serverEnv";

// export const runtime = "nodejs";




// export async function getHomeImages() {
//   const res = await fetch(
//     `${IMAGE_BASE_URL_SC}/data/jsonData/homeDataImages.json`,
//     { cache: "no-store" }
//   );
//   const result = await res.json();
//   return result.images ?? [];
// }
import { IMAGE_BASE_URL_SC } from "@/shared/constants/serverEnv";

export const runtime = "nodejs";

export async function getHomeImages() {
  const res = await fetch(
    `${IMAGE_BASE_URL_SC}/data/jsonData/homeDataImages.json`,
    { cache: "no-store" }
  );

  // ✅ 실패하면 바로 원인 보여주기
  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `getHomeImages failed: ${res.status}\n${text}`
    );
  }

  const result = await res.json();
  return result.images ?? [];
}
