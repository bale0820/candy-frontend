"use client";

import Link from "next/link";
import "./pricing.scss";
import { usePricingData } from "@/features/administration/price/usePricingData";
import PricingConversionChart from "@/features/administration/price/components/PricingConversionChart";

export default function PricingConversionPage() {
    const {
        data,
        labels,
        prices,
        clicks,
        orders,
        rates,
        aiRates,
        aiClickRates,
        aiPrices,
    } = usePricingData();

    return (
        <div className="pricing-page">
            <h1>📊 AI 가격 최적화 분석 (전체 상품)</h1>

            {data.length > 0 ? (
                <>
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

                    <div className="detail-section">
                        <h2>상품 상세 분석 보기</h2>
                        <ul>
                            {data.map((d) => (
                                <li key={d.ppk}>
                                    <Link href={`/admin/pricing/${d.ppk}`}>
                                        {d.productName}
                                        <span>{d.currentPrice.toLocaleString()}원</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            ) : (
                <p>데이터를 불러오는 중...</p>
            )}
        </div>
    );
}
