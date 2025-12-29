"use client";

import Swal from "sweetalert2";
import React, { useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AddQnA from "./AddQnA";
import "./QnA.scss";
import { useProductQnAList } from "@/features/product/hooks/useProductQnAList";
import {useAuthStore} from "@/store/authStore";
import {api} from "@/shared/lib/axios";

export function QnA({ id, product }) {
  // 🔥 React Query로 QnA 데이터 가져오기
  const {
    data: qnaAll = [],
    isLoading,
    isError,
  } = useProductQnAList(id);
  console.log("qnaAll", qnaAll);

  const router = useRouter();
  const pathname = usePathname();

  const [currentPage, setCurrentPage] = useState(1);
  const [isClickQnA, setIsClickQnA] = useState(false);

  const itemsPerPage = 5;

  // 로그인 여부 (Next.js에서는 Zustand 또는 cookie 기반이라 가정)
  const { isLogin, userId } = useAuthStore(); // 👉 필요 시 Zustand store 또는 cookie에서 가져오면 됨
  // 🔹 2) 해당 상품의 QnA만 필터링
  const qnaList = useMemo(() => {
    return qnaAll
      .filter((item) => Number(item?.ppk) === Number(id))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [qnaAll, id]);

  // 🔹 3) 페이지 슬라이싱
  const currentItems = useMemo(() => {
    return qnaList.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [qnaList, currentPage]);
  // 🔹 1) 로딩/에러 처리
  if (isLoading) return <p>문의글을 불러오는 중...</p>;
  if (isError) return <p>문의 정보를 가져오지 못했습니다.</p>;

  const handleNext = () =>
    setCurrentPage((prev) =>
      prev * itemsPerPage < qnaList.length ? prev + 1 : prev
    );

  const handlePrev = () =>
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));

  // 🔹 4) 문의하기 버튼 클릭
  const handleQnA = () => {
    if (!isLogin) {
      Swal.fire({
        icon: "warning",
        title: "⚠ 로그인 필요",
        text: "로그인이 필요합니다.",
      }).then(() => {
        router.push(`/login?from=${pathname}`);
      });
      return;
    }
    setIsClickQnA(true);
  };

  // 🔹 5) 문의 등록
  const handleAddQnA = async (qnaData) => {
    console.log("qnaData",qnaData);
    try {
      await api.post("/product/addQnA", qnaData);

      Swal.fire({
        icon: "success",
        title: "문의 등록 성공!",
        text: "문의가 등록되었습니다.",
      }).then(() => {
        setIsClickQnA(false);
      });
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "문의 등록 실패",
        text: "다시 시도해주세요.",
      });
    }
  };

  return (
    <div className="qna-section">
      <div className="title-area">
        <h2>상품 문의</h2>
        <button onClick={handleQnA}>문의하기</button>

        {/* 문의하기 팝업 */}
        {isClickQnA && (
          <AddQnA
            onAddQnA={handleAddQnA}
            onClose={() => setIsClickQnA(false)}
            product={product}
            userId = {userId}
          />
        )}
      </div>

      <p className="qna-desc">
        상품에 대한 문의를 남기는 공간입니다. 배송/주문 관련 문의는{" "}
        <span className="highlight">고객센터</span>를 이용해주세요.
      </p>

      <table className="qna-table">
        <thead>
          <tr>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>답변상태</th>
          </tr>
        </thead>

        <tbody>
          {currentItems.length === 0 ? (
            <tr className="no-qna">
              <td colSpan={4}>이 상품에 대한 문의글이 없습니다.</td>
            </tr>
          ) : (
            currentItems.map((item, idx) => (
              <tr key={idx}>
                <td>
                  {item.is_private ? (
                    <>
                      비밀글입니다 <span className="lock-icon">🔒</span>
                    </>
                  ) : (
                    item.title
                  )}
                </td>
                <td>{item.writer}</td>
                <td>{new Date(item.date).toLocaleDateString("ko-KR")}</td>
                <td className={`status ${item.status === "답변대기" ? "wait" : ""}`}>
                  {item.status}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      {currentItems.length > 0 && (
        <div className="pagination">
          <button onClick={handlePrev} disabled={currentPage === 1}>
            {"<"}
          </button>
          <span>
            {currentPage} / {Math.ceil(qnaList.length / itemsPerPage)}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage * itemsPerPage >= qnaList.length}
          >
            {">"}
          </button>
        </div>
      )}
    </div>
  );
}
