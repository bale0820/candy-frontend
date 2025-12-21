import { API_BASE_URL_SC } from "@/shared/constants/serverEnv";


export const runtime = "nodejs";



// features/home/server/advertise.js
export async function getAdvertiseList() {
  const res = await fetch(`${API_BASE_URL_SC}/advertise/list`, {
    cache: "no-store",
  });

   // 🔥 이 줄이 핵심
  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `getAdvertiseList failed: ${res.status}\n${text}`
    );
  }

  const list = await res.json();

  return {
    bannerAds: list.filter(ad => ad?.advImageBanner),
    inlineAds: list.filter(ad => ad?.advImageInline),
  };
}
