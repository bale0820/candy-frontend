"use client";

import { memo, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MdOutlineArrowForwardIos,
  MdOutlineArrowBackIosNew,
} from "react-icons/md";

import "./ProductList.scss";
import ProductCard from "@/shared/productCard/ProductCart";

function ProductList({
  title = "오늘의 특가",
  limit = 20,
  keyword,
  serverProducts = [], // ✅ 기본값
}) {
  const router = useRouter();

  // ✅ 서버에서 내려준 데이터만 사용
  const productList = serverProducts;

  const sliderRef = useRef(null);
  const isDragging = useRef(false);
  const prevX = useRef(0);
  const velocity = useRef(0);
  const momentumId = useRef(null);
  const totalMoved = useRef(0);
  const dragPreventClick = useRef(false);

  const dragThreshold = 5;

  // ========================================
  // 🔹 필터 처리
  // ========================================
  const productFilterList = useMemo(() => {
    if (productList.length === 0) return [];

    switch (keyword) {
      case "time": // 등록일 오래된 순
        return [...productList]
          .sort((a, b) => new Date(a.productDate) - new Date(b.productDate))
          .slice(0, limit);

      case "sale": // 할인율 높은 순
        return productList
          .filter((item) => item?.dc >= 10)
          .sort((a, b) => b.dc - a.dc)
          .slice(0, limit);

      default:
        return productList.slice(0, limit);
    }
  }, [productList, keyword, limit]);

  // ========================================
  // 🔹 드래그 로직
  // ========================================
  const stopMomentum = () => cancelAnimationFrame(momentumId.current);

  const startMomentum = () => {
    const el = sliderRef.current;
    if (!el) return;

    const animate = () => {
      el.scrollLeft -= velocity.current;
      velocity.current *= 0.95;

      if (Math.abs(velocity.current) > 0.1) {
        momentumId.current = requestAnimationFrame(animate);
      }
    };

    animate();
  };

  const handleMouseDown = (e) => {
    stopMomentum();
    isDragging.current = true;
    prevX.current = e.pageX;
    velocity.current = 0;
    totalMoved.current = 0;
    dragPreventClick.current = false;
    sliderRef.current.classList.add("dragging");
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;

    e.preventDefault();
    const el = sliderRef.current;
    const delta = e.pageX - prevX.current;
    prevX.current = e.pageX;

    totalMoved.current += Math.abs(delta);
    if (totalMoved.current > dragThreshold) {
      dragPreventClick.current = true;
    }

    el.scrollLeft -= delta;
    velocity.current = delta;
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;

    isDragging.current = false;
    sliderRef.current.classList.remove("dragging");
    startMomentum();
  };

  const handleMouseLeave = () => {
    if (isDragging.current) {
      isDragging.current = false;
      sliderRef.current.classList.remove("dragging");
      startMomentum();
    }
  };

  // ========================================
  // 🔹 좌/우 버튼 스크롤
  // ========================================
  const scrollByCards = (direction) => {
    const el = sliderRef.current;
    if (!el) return;

    const slideEl = el.querySelector(".slide");
    if (!slideEl) return;

    const slideWidth = slideEl.offsetWidth + 10;
    const scrollAmount = slideWidth * 5;

    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // 🔹 전체보기 버튼
  const handleAllView = () => {
    router.push(`/productList/${keyword}`);
  };

  return (
    <section className="home-page">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>

        <button className="view-all-btn" onClick={handleAllView}>
          전체보기 &gt;
        </button>
      </div>

      <div className="slider-wrapper">
        <button className="nav-button left" onClick={() => scrollByCards("left")}>
          <MdOutlineArrowBackIosNew />
        </button>

        <div
          className="slider-container"
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <div className="slides">
            {productFilterList.map((item) => (
              <Link
                href={`/products/${item?.id}`}
                className="slide"
                key={item?.id}
                draggable="false"
                onClick={(e) => {
                  if (dragPreventClick.current) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
              >
                <ProductCard item={item} />
              </Link>
            ))}
          </div>
        </div>

        <button className="nav-button right" onClick={() => scrollByCards("right")}>
          <MdOutlineArrowForwardIos />
        </button>
      </div>
    </section>
  );
}

export default memo(ProductList);
