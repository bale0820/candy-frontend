import { API_BASE_URL_SC } from "@/shared/constants/serverEnv";


export const runtime = "nodejs";



// features/home/server/advertise.js
export async function getAdvertiseList() {
  const res = await fetch(`${API_BASE_URL_SC}/advertise/list`, {
    cache: "no-store",
  });

  const list = await res.json();

  return {
    bannerAds: list.filter(ad => ad?.advImageBanner),
    inlineAds: list.filter(ad => ad?.advImageInline),
  };
}
