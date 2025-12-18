"use client";

import { IMAGE_BASE_URL } from "@/shared/constants/imageBaseUrl";
import "./SlideContainer.scss";
import { SlideDots } from "./SlideDots";
import { IoIosRadioButtonOn } from "react-icons/io";

export function SlideContainer({ images, index, setIndex }) {
  if (!images || images.length === 0)
    return <div className="slide-container skeleton">배너 불러오는 중...</div>;

  return (
    <div className="slide-container">
      {images.map((img, i) => (
        <div 
          key={`${IMAGE_BASE_URL}/${img}`} 
          className={`slide-wrapper ${index === i ? "active" : ""}`}
        >
          <img 
            src={`${IMAGE_BASE_URL}/${img}`}   // ⬅ 여기 반드시 수정
            alt={`slide-${i}`} 
            className="slide-image" 
          />
        </div>
      ))}

      <SlideDots
        count={images.length}
        activeIndex={index}
        setIndex={setIndex}
        icon={<IoIosRadioButtonOn />}
      />
    </div>
  );
}
