"use client";

import { useEffect, useState } from "react";
import "./advertise.css";
import { IMAGE_BASE_URL } from "@/shared/constants/clientEnv";

export function RightAdBanner({ ads = [], interval = 3000, random = false }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (ads.length === 0) return;

    const timer = setInterval(() => {
      setIndex((prev) => {
        if (random) {
          return Math.floor(Math.random() * ads.length);
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
    <div className="right-ad-banner">
      <a
        href={ad.advLink}
        target="_blank"
        rel="noopener noreferrer nofollow sponsored"
      >
        <img
          className="banner-img"
          src={`${IMAGE_BASE_URL}/data${ad.advImageBanner}`}
          alt={ad.advName ? `${ad.advName} 광고 배너` : "광고 배너"}
        />
      </a>
    </div>
  );
}
