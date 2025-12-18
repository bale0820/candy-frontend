"use client";

import { useEffect, useState } from "react";
import { api } from "@/shared/lib/axios";

export function useAdvertiseList() {
  const [advertiseList, setAdvertiseList] = useState([]);

  useEffect(() => {
    const fetchAdvertises = async () => {
      try {
        const res = await api.get("/advertise/list");
        setAdvertiseList(res.data || []);
      } catch (err) {
        console.error("광고 데이터 로딩 실패:", err);
      }
    };
    fetchAdvertises();
  }, []);

  // ⭐ 광고 종류 분류 (null 방지)
  const bannerAds = advertiseList.filter(
    (ad) => ad?.advImageBanner && ad.advImageBanner !== ""
  );

  const inlineAds = advertiseList.filter(
    (ad) => ad?.advImageInline && ad.advImageInline !== ""
  );

  return { bannerAds, inlineAds };
}
