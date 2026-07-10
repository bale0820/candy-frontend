"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "./pricingDetail.scss"; // SCSS 경로는 너 프로젝트 기준으로 수정
import { api } from "@/shared/lib/axios";
import PricingConversionChart from "@/features/administration/pricingConversion/components/PricingConversionChart";

export default function ProductPricingDetailPage() {
  const { ppk } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    if (ppk) load();
  }, [ppk]);

  const load = async () => {
    const res = await api.get(`/api/admin/pricing/${ppk}`);
    setItem(res.data);
  };

  if (!item) return <p className="loading">로딩 중...</p>;

  const labels = [item.productName];
  const prices = [item.currentPrice];
  const aiPrices = [item.aiLowerPrice];
  const clicks = [item.clicks];
  const orders = [item.orders];
  const rates = [item.conversionRate.toFixed(2)];
  const aiRates = [item.aiConversionRate.toFixed(2)];
  const aiClickRates = [item.aiClickRate.toFixed(2)];

  return (
    <div className="pricing-detail-container">
      <div className="header-box">
        <h1>📈 {item.productName} - AI 가격 상세 분석</h1>
        <p className="sub">
          클릭·구매·전환율·예측매출을 기반으로 계산된 AI 가격 최적화 결과입니다.
        </p>
      </div>

      {/* 차트 */}
      <div className="chart-wrapper">
        <PricingConversionChart
          labels={labels}
          prices={prices}
          clicks={clicks}
          orders={orders}
          rates={rates}
          aiRates={aiRates}
          aiClickRates={aiClickRates}
          aiPrices={aiPrices}
        />
      </div>

      {/* 상세 테이블 */}
      <div className="detail-table-box">
        <h2>📊 상세 지표</h2>

        <table className="detail-table">
          <tbody>
            <tr><th>현재 가격</th><td>{item.currentPrice.toLocaleString()} 원</td></tr>
            <tr><th>AI 추천 가격</th><td className="highlight">{item.aiLowerPrice.toLocaleString()} 원</td></tr>

            <tr><th>클릭수</th><td>{item.clicks} 회</td></tr>
            <tr><th>구매수</th><td>{item.orders} 건</td></tr>

            <tr><th>현재 전환율</th><td>{item.conversionRate.toFixed(2)}%</td></tr>
            <tr><th>예측 전환율</th><td className="improved">{item.aiConversionRate.toFixed(2)}%</td></tr>

            <tr><th>가격 민감도</th><td>{item.priceSensitivity.toFixed(4)}</td></tr>
            <tr><th>예상 구매수</th><td>{item.predictedOrders.toFixed(2)} 건</td></tr>

            <tr><th>현재 매출</th><td>{item.currentRevenue.toLocaleString()} 원</td></tr>
            <tr><th>예측 매출</th><td className="improved">{item.predictedRevenue.toLocaleString()} 원</td></tr>

            <tr><th>매출 증가량</th><td className="highlight">+ {item.revenueGain.toLocaleString()} 원</td></tr>
            <tr><th>매출 증가율</th><td className="improved">{item.revenueGainPercent.toFixed(2)}%</td></tr>

            <tr><th>가격 탄력성 (PED)</th><td>{item.ped.toFixed(4)}</td></tr>
            <tr><th>최적 가격</th><td>{Math.floor(item.optimalPrice).toLocaleString()} 원</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
