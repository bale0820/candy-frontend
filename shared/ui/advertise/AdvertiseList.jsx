"use client";

import { useEffect, useState } from "react";
import "./advertise.css";
import { IMAGE_BASE_URL } from "@/shared/constants/imageBaseUrl";

export function AdvertiseList({ ads = [], interval = 3000, random = false }) {
  const [index, setIndex] = useState(0);

  // 🔹 광고 자동 교체
  useEffect(() => {
    if (ads.length === 0) return;

    const timer = setInterval(() => {
      setIndex((prev) => {
        if (random) {
          let next = Math.floor(Math.random() * ads.length);
          // 동일 광고가 연속으로 나오지 않도록 조정
          return next === prev ? (next + 1) % ads.length : next;
        }
        return (prev + 1) % ads.length;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [ads, interval, random]);

  if (ads.length === 0) return null;

  const ad = ads[index];
  if (!ad) return null;

  return (
    <div className="advertise-list">
      <a href={ad.advLink} target="_blank" rel="noreferrer">
        <img
          className="advertise-inline"
          src={`${IMAGE_BASE_URL}${ad.advImageInline}`}
          alt={ad.advName ?? "advertise-inline"}
        />
      </a>
    </div>
  );
}
