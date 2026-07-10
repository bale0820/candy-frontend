"use client";

import React, { useMemo, useRef, useState, useEffect, useLayoutEffect } from "react";
import "./ReviewList.scss";
import { useProductReviewList } from "@/features/product/hooks/useProductReviewList";
import { IMAGE_BASE_URL } from "@/shared/constants/clientEnv";


export function ReviewList({ id }) {
  const {
    data: productReviewList = [],
    isLoading,
    isError,
  } = useProductReviewList();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const containerRef = useRef(null);
  const isFirstRender = useRef(true);

  // 🔥 Hook은 return 이전에서 항상 실행되어야 한다
  const productReviews = useMemo(() => {
    return productReviewList.filter((review) => review?.ppk === Number(id));
  }, [productReviewList, id]);

  const reviewImages = useMemo(() => {
    return productReviews.flatMap((r) => r.images || []).slice(0, 6);
  }, [productReviews]);

  const currentItems = useMemo(() => {
    return productReviews.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [productReviews, currentPage]);

 useLayoutEffect(() => {
  if (currentPage === 1 && isFirstRender.current) return;

  containerRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}, [currentPage]);

  const handleNext = () => {
    setCurrentPage((prev) =>
      prev * itemsPerPage < productReviews.length ? prev + 1 : prev
    );
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  // 🔥 모든 hook이 호출된 후 렌더링 분기 실행
  if (isLoading) return <p>리뷰를 불러오는 중...</p>;
  if (isError) return <p>리뷰 정보를 가져오지 못했습니다.</p>;

  return (
    <div className="review-list" ref={containerRef}>
      <h2>상품 후기</h2>
      <p>총 {productReviews.length.toLocaleString()}개</p>

      {productReviews.length === 0 ? (
        <p>상품 후기가 존재하지 않습니다.</p>
      ) : (
        <>
          <div className="review-images">
            {reviewImages.map((img, i) => (
              <div key={i} className="review-thumb">
                <img src={`${IMAGE_BASE_URL}/data${img}`} alt={`review-${i}`} />
              </div>
            ))}
          </div>

          {currentItems.map((r, idx) => (
            <div key={idx} className="review-card">
              {r.isBest && <span className="badge">베스트</span>}
              <h3>{r.productName}</h3>
              <p className="review-title">{r.title}</p>
              <p className="review-content">{r.content}</p>

              <div className="review-images">
                {r.images.map((img, i) => (
                  <img key={i} src={`${IMAGE_BASE_URL}/data${img}`} alt="리뷰 이미지" />
                ))}
              </div>

              <div className="review-footer">
                <div className="user-Date">
                  <span>{r.userId}</span>
                  <span className="date">{r.date}</span>
                </div>
                <span className="likes">도움돼요 {r.likes}</span>
              </div>

              <div className="tags">
                {r.tags.map((tag, i) => (
                  <span key={i} className="tag">#{tag}</span>
                ))}
              </div>
            </div>
          ))}

          <div className="pagination">
            <button onClick={handlePrev} disabled={currentPage === 1}>
              {"<"}
            </button>

            <span style={{ margin: "0 0.6rem" }}>
              {currentPage} / {Math.ceil(productReviews.length / itemsPerPage)}
            </span>

            <button
              onClick={handleNext}
              disabled={currentPage * itemsPerPage >= productReviews.length}
            >
              {">"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
