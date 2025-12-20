"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { useNoticeList } from "@/features/notice/hooks//useNoticeList";
import "./NoticeList.scss";

export default function NoticeList() {
  const { data: noticeList = [], isLoading } = useNoticeList();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  
  // 🔹 최신순 정렬 (createdAt 기준)
  const sortedNotices = useMemo(() => {
    return [...noticeList].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [noticeList]);
  
  if (isLoading) return <p>불러오는 중...</p>;

  // 🔹 페이지네이션 영역
  const currentItems = sortedNotices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNext = () => {
    setCurrentPage((prev) =>
      prev * itemsPerPage < sortedNotices.length ? prev + 1 : prev
    );
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  return (
    <div className="notice-section">
      <h2>공지사항</h2>
      <p className="notice-desc">
        서비스 관련 주요 공지와 안내사항을 확인하실 수 있습니다.
      </p>

      <table className="notice-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>등록일</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((item, index) => (
              <tr key={item?.id}>
                {/* 번호: 전체 개수 - 현재 시작 index */}
                <td>
                  {sortedNotices.length -
                    ((currentPage - 1) * itemsPerPage + index)}
                </td>

                <td className="title">
                  <Link href={`/notice/${item?.id}`}>{item.title}</Link>
                </td>

                <td>
                  {new Date(item.createdAt).toLocaleDateString("ko-KR")}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="empty">
                등록된 공지사항이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 🔹 페이지네이션 */}
      <div className="pagination">
        <button onClick={handlePrev} disabled={currentPage === 1}>
          {"<"}
        </button>

        <span style={{ margin: "0 0.6rem" }}>
          {currentPage} / {Math.ceil(sortedNotices.length / itemsPerPage)}
        </span>

        <button
          onClick={handleNext}
          disabled={currentPage * itemsPerPage >= sortedNotices.length}
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
