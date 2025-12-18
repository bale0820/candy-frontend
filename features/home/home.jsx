
"use client";

import React from "react";
import RecommendedSlider from "@/shared/ui/recommend/RecommendedSlider";
import { SlideContainer } from "@/shared/ui/slider/SlideContainer";
import { useRecentCategory } from "@/features/category/hooks/useRecentCategory";
import { RightAdBanner } from "@/shared/ui/advertise/RightAdBanner";
import { AdvertiseList } from "@/shared/ui/advertise/AdvertiseList";
import { useHomePopup } from "./hooks/useHomePopup";
import Popup from "@/shared/ui/popup/Popup";
import { useAutoSlider } from "@/shared/hooks/useAutoSlider";


export default function Home({
  bannerAds,
  inlineAds,
  images,
  children, // ✅ 추가
}) {
  const { index, setIndex } = useAutoSlider(images.length, 5000);

  useRecentCategory();
  const { showPopup, handleClosePopup } = useHomePopup();

  return (
    <>
      <h1 className="sr-only">
        Candy Market 할인·특가 쇼핑몰
      </h1>
      
      <RightAdBanner ads={bannerAds} />

      {showPopup && <Popup onClose={handleClosePopup} />}

      <SlideContainer images={images} index={index} setIndex={setIndex} />

      <RecommendedSlider title="좋아할만한 브랜드 상품" limit={15} />

      <AdvertiseList ads={inlineAds} />

      {/* 🔽 여기! 서버에서 내려온 컴포넌트 자리 */}
      {children}
    </>
  );
}
