"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import "./NoticeDetail.scss";
import { useNoticeList } from "@/features/notice/hooks/useNoticeList";

export default function NoticeDetail() {
  const { id } = useParams();
  const noticeId = Number(id);

  const { data: notices = [], isLoading } = useNoticeList();

  if (isLoading) return <p>불러오는 중...</p>;

  const notice = notices.find((n) => n??.id === noticeId);

  if (!notice) {
    return <p>공지사항을 찾을 수 없습니다.</p>;
  }

  return (
    <div className="notice-detail">
      <h1 className="title">{notice.title}</h1>

      <p className="date">
        {new Date(notice.createdAt).toLocaleString("ko-KR")}
      </p>

      <div className="content">{notice.content}</div>

      <Link href="/notice" className="btn-back">
        목록으로 돌아가기
      </Link>
    </div>
  );
}
