// features/home/server/advertise.js
export async function getAdvertiseList() {
  const res = await fetch("http://localhost:8080/advertise/list", {
    cache: "no-store",
  });

  const list = await res.json();

  return {
    bannerAds: list.filter(ad => ad?.advImageBanner),
    inlineAds: list.filter(ad => ad?.advImageInline),
  };
}
