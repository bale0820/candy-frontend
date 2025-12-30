



// pages/coupon/CouponPage.jsx

"use client";

import { IMAGE_BASE_URL } from "@/shared/constants/clientEnv";
import { CouponButtons } from "features/coupon/components/CouponButtons";
import { useCoupon } from "features/coupon/hooks/useCoupon";

export default function CouponPage() {
  const { userId, couponList, issuedCoupons, issueCoupon } = useCoupon();

  return (
    <div style={{ fontFamily: "'Pretendard', sans-serif", maxWidth: "1200px" }}>
      {/* 배너 이미지 */}
      <div
        style={{
          height: "100vh",
          backgroundImage: `url("${IMAGE_BASE_URL}/data/popupimage/coupon_image3.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <CouponButtons
        userId={userId}
        couponList={couponList}
        issuedCoupons={issuedCoupons}
        onIssue={issueCoupon}
      />
    </div>
  );
}

