import { IMAGE_BASE_URL } from "@/shared/constants/clientEnv";

export const runtime = "nodejs";




export async function getHomeImages() {
  const res = await fetch(
    `${IMAGE_BASE_URL}/data/jsonData/homeDataImages.json`,
    { cache: "no-store" }
  );
  const result = await res.json();
  return result.images ?? [];
}
