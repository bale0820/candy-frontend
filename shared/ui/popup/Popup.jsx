"use client";

import { useRouter } from "next/navigation";
import "./Popup.css";
import { IMAGE_BASE_URL } from "@/shared/constants/clientEnv";
export default function Popup({ onClose, onTodayHide }) {
  const router = useRouter();

  return (
    <div className="popup-container">
      <div className="popup-content">
        {/* 🔥 오른쪽 위 X 버튼만 추가 */}
     
          <span className="popup-text">오늘 하루안보기</span>
        <button
          className="popup-close-x"
          onClick={onTodayHide}
          aria-label="닫기"
        >
        ✕
        </button>
      

        <img
          src={`${IMAGE_BASE_URL}/data/popupimage/coupon_image1.png`}
          alt="쿠폰"
          className="popup-image"
        />

        <button
          className="get-coupon-button"
          onClick={() => router.push("/coupon")}
        >
          쿠폰받으러가기
        </button>

        <button className="popup-close-btn" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}
