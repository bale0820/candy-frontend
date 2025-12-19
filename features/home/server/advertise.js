export const runtime = "nodejs";

import { API_BASE_URL } from "@/shared/constants/apiBaseUrl";

// features/home/server/advertise.js
export async function getAdvertiseList() {
  const res = await fetch(`${API_BASE_URL}/advertise/list`, {
    cache: "no-store",
  });

  const list = await res.json();

  return {
    bannerAds: list.filter(ad => ad?.advImageBanner),
    inlineAds: list.filter(ad => ad?.advImageInline),
  };
}
