"use client";

import { SummaryCards } from "@/features/administration/reviewAnalysis/components/SummaryCards";
import { TopProducts } from "@/features/administration/reviewAnalysis/components/TopProducts";
import { ReviewSearch } from "@/features/administration/reviewAnalysis/components/ReviewSearch";
import { ReviewProductList } from "@/features/administration/reviewAnalysis/components/ReviewProductList";
import { useReviewList } from "@/features/administration/reviewAnalysis/useReviewList";
import "./ReviewListPage.scss";

export default function ReviewListPage() {
  const { search, setSearch, summary, filtered } = useReviewList();

  return (
    <div className="review-dashboard">
      <h2 className="page-title">📊 AI 리뷰 분석 대시보드</h2>

      <SummaryCards summary={summary} />
      <TopProducts top={summary.topProducts} />
      <ReviewSearch search={search} setSearch={setSearch} />
      <ReviewProductList filtered={filtered} />
    </div>
  );
}
