"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/shared/lib/axios";
import "../login.scss";
import axios from "axios";

export default function FindUserIdClient() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // 이전 에러 초기화

    try {
      const response = await axios.get("http://localhost:8080/member/find-user-id", {
        params: { query },
      });

      setResult(response.data); // ✅ 항상 배열
    } catch (err) {
      console.error(err);
      setResult([]); // 결과 초기화
      setError("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div className="content">
      <div className="center-layout login-form">
        <h1 className="center-title">아이디 찾기</h1>

        <form onSubmit={handleSubmit}>
          <ul>
            <li>
              <div className="login-form-input">
                <input
                  type="text"
                  placeholder="휴대폰 번호 또는 이메일 입력"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </li>

            <li>
              <button type="submit" className="btn-main-color">
                아이디 찾기
              </button>
            </li>

            {/* 결과 영역 */}
            {result.length > 0 && (
              <li className="result-box">
                <p className="result-title">조회된 아이디</p>

                <ul className="result-list">
                  {result.map((item, idx) => (
                    <li key={idx} className="result-item">
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            )}

            {/* 결과 없음 */}
            {result.length === 0 && !error && (
              <li className="result-empty">
                <span>입력한 정보로 조회된 아이디가 없습니다.</span>
              </li>
            )}

            {/* 에러 */}
            {error && (
              <li className="result-error">
                <span>{error}</span>
              </li>
            )}
          </ul>
        </form>

        <button
          className="btn-main-color"
          onClick={() => router.push("/login")}
        >
          로그인 페이지로
        </button>
      </div>
    </div>
  );
}
