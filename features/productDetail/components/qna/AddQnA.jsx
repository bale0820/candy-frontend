"use client";

import Swal from "sweetalert2";
import React, { useState } from "react";
import "./AddQnA.css";

export default function AddQnA({ onAddQnA, onClose, product , userId }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = () => {
    const qnaData = {
      ppk: product.id,
      title,
      content,
      isPrivate,
      upk: userId
    };

    if (!title.trim()) {
      Swal.fire("제목을 입력해주세요");
      return;
    }

    if (!content.trim()) {
      Swal.fire("내용을 입력해주세요");
      return;
    }

    onAddQnA(qnaData);
  };

  return (
    <div className="popup-backdrop">
      <div className="popup-box">
        <div className="popup-header">
          <h2>상품 문의하기</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="product-area">
          <img
            src={`/data/productImages/${product.imageUrl}`}
            alt={product.imageUrl_name}
            className="product-img"
          />
          <div className="product-title">{product.productName}</div>
        </div>

        <div className="form-area">
          <label className="label">제목</label>
          <input
            type="text"
            className="input"
            placeholder="제목을 입력해주세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className="label">내용</label>
          <textarea
            className="textarea"
            placeholder="내용을 입력해주세요. (최대 5000자)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>

          <div className="secret-box">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
            <label>비밀글로 문의하기</label>
          </div>
        </div>

        <div className="bottom-buttons">
          <button onClick={handleSubmit}>등록</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}
