"use client";

import { IMAGE_BASE_URL } from "@/shared/constants/imageBaseUrl";

export function Detail({images}) {
  return (
    <div>
      <h2 style={ {marginBottom: "10px"}}>상세 설명</h2>
      { !images ? "상세 정보가 존재하지 않습니다. " :
        <img src={`${IMAGE_BASE_URL}/productInformation/${images}`} alt="" style={{ width: "100%" }} />
      }
    </div>
  );
}