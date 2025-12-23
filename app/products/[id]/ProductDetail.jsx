"use client";

import "./ProductDetail.scss";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

import { useProductDetail } from "@/features/productDetail/hooks/useProductDetail";
import { Item } from "@/features/productDetail/components/item/Item";
import { Detail } from "@/features/productDetail/components/detail/Detail";
import { ReviewList } from "@/features/productDetail/components/review/components/ReviewList";
import { QnA } from "@/features/productDetail/components/qna/QnA";
import { Return } from "@/features/productDetail/components/return/Return";
import { IMAGE_BASE_URL } from "@/shared/constants/clientEnv";

export default function ProductDetail({ product }) {

  const {
    count,
    salesPrice,
    handleDecrease,
    handleIncrease,
    handleChange,
    handleAddCart,
    itemRef,
    detailRef,
    reviewRef,
    qnaRef,
    returnRef,
    handleTabClick,
  } = useProductDetail(product);
  const id = product?.id;

  if (!product) return <p>상품 정보를 찾을 수 없습니다.</p>;

  return (
    <div className="product-container">
      <div className="product-detail">
        <div className="product-detail-main">
          {/* ----------------------- 이미지 ----------------------- */}
          <div className="product-image">
            <div
              className={`badge-container ${product.hotDeal && product.memberSpecial ? "multi" : ""
                }`}
            >
              {product.hotDeal && <span className="badge hot">원딜핫딜</span>}
              {product.memberSpecial && (
                <span className="badge member">멤버특가</span>
              )}
            </div>

            <div className="product-image-container">
              <img
                src={`${IMAGE_BASE_URL}/data/productImages/${product.imageUrl}`}
                alt={`${product.productName} 상품 이미지`}
                loading="eager"
              />
              {product.count <= 0 && <div className="sold-out">SOLD OUT</div>}
            </div>
          </div>

          {/* ----------------------- 상품 정보 ----------------------- */}
          <div className="product-info">
            <div className="product-info-top">
              <div className="product-info-left">
                {product.productName} ㅣ{" "}
                <Link
                  href={`/search/brand/${encodeURIComponent(product.brandName)}`}
                  className="product-brand"
                >
                  {product.brandName}
                </Link>
              </div>
            </div>

            <div className="product-title">
              [{product.brandName}] {product.productName}
            </div>

            <div className="product-discount red">
              {Math.floor(product.price * (product.dc / 100)).toLocaleString()}
              원 할인
              <span className="product-price-original line">
                {product.price?.toLocaleString()}원
              </span>
            </div>

            <div className="product-price-final">
              {salesPrice.toLocaleString()}원
            </div>

            <hr />

            {/* Meta 정보 */}
            <ul className="product-meta">
              <li>상품번호</li>
              <li>{product.pid}</li>
            </ul>

            <ul className="product-meta">
              <li>배송</li>
              <li>
                {product.delName}
                <br />
                {product.delDescription &&
                  product.delDescription.split("\n").map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
              </li>
            </ul>

            <ul className="product-meta"><li>판매자</li><li>{product.seller}</li></ul>
            <ul className="product-meta"><li>원산지</li><li>{product.origin}</li></ul>
            <ul className="product-meta"><li>판매단위</li><li>{product.unit}</li></ul>
            <ul className="product-meta"><li>중량/용량</li><li>{product.weight}</li></ul>
            <ul className="product-meta"><li>총 수량</li><li>{product.count?.toLocaleString()}개</li></ul>

            <hr />

            {/* 구매 옵션 */}
            <div className="product-purchase">
              <ul className="product-purchase-info">
                <li>수량</li>
                <li>
                  <div className="product-qty-control">
                    <button className="qty-btn" onClick={handleDecrease}>
                      -
                    </button>

                    <input
                      className="qty-input"
                      type="text"
                      value={count.toLocaleString()}
                      onChange={handleChange}
                    />

                    <button className="qty-btn" onClick={handleIncrease}>
                      +
                    </button>
                  </div>
                </li>
              </ul>

              <ul className="product-purchase-info">
                <li>총금액 (부가세포함)</li>
                <li>{(salesPrice * count).toLocaleString()}원</li>
              </ul>
            </div>

            <div className="product-buttons">
              <button
                className="btn-cart"
                onClick={handleAddCart}
                disabled={product.count <= 0}
              >
                장바구니
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------- 탭 ----------------------- */}
      <div className="product-tabs">
        <ul className="product-tab-list">
          <li><button onClick={() => handleTabClick(itemRef)}>속성정보</button></li>
          <li><button onClick={() => handleTabClick(detailRef)}>상세정보</button></li>
          <li><button onClick={() => handleTabClick(reviewRef)}>구매후기</button></li>
          <li><button onClick={() => handleTabClick(qnaRef)}>상품문의</button></li>
          <li><button onClick={() => handleTabClick(returnRef)}>배송/반품/교환정보</button></li>
        </ul>
      </div>

      {/* ----------------------- 탭 콘텐츠 ----------------------- */}
      <div className="product-tab-content">
        <section ref={itemRef} id="item">
          <Item images={product.productInformationImage} />
        </section>

        <section ref={detailRef} id="detail">
          <Detail images={product.productDescriptionImage} />
        </section>
        <section ref={reviewRef} id="review">
          <ReviewList id={id} />
        </section>

        <section ref={qnaRef} id="qna">
          <QnA id={id} product={product} />
        </section>

        <section ref={returnRef} id="return">
          <Return />
        </section>
      </div>
    </div>
  );
}
