"use client";
import { useUserDetail } from "@/features/mypage/userdetail/hooks/useUserDetail";
import "./userdetail.css";

export default function userdetail() {
  const { user, handleEditField } = useUserDetail();

  if (!user) return <p>⏳ 불러오는 중...</p>;

  return (
    <div className="user-detail-container">
      <h2 className="section-title">기본정보</h2>

      <div className="user-card">
        {/* 이름 */}
        <div className="user-item">
          <div>
            <div className="user-label">회원명</div>
            <div className="user-value">{user.name}</div>
          </div>
          <button
            className="edit-btn"
            onClick={() => handleEditField("name", "회원명", user.name)}
          >
            수정
          </button>
        </div>

        {/* 전화번호 */}
        <div className="user-item">
          <div>
            <div className="user-label">전화번호</div>
            <div className="user-value">{user.phone}</div>
          </div>
          <button
            className="edit-btn"
            onClick={() => handleEditField("phone", "전화번호", user.phone)}
          >
            수정
          </button>
        </div>

        {/* 이메일 */}
        <div className="user-item">
          <div>
            <div className="user-label">이메일</div>
            <div className="user-value">{user.email}</div>
          </div>
          <button
            className="edit-btn"
            onClick={() => handleEditField("email", "이메일", user.email)}
          >
            수정
          </button>
        </div>
      </div>
    </div>
  );
}