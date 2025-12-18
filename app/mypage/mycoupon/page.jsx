"use client";
import { useMyCoupon } from '@/features/mypage/mycoupon/hooks/useMyCoupon';
import { MyCouponList } from '@/features/mypage/mycoupon/components/MyCouponList';

export default function MyCoupon() {
  const { userId, coupons, loading, deleteCoupon } = useMyCoupon();

  if (!userId) {
    return <p>로그인 후 이용해주세요.</p>;
  }

  if (loading) {
    return <p>로딩 중...</p>;
  }

  return (
    <div className="mypage-container">
      <h2 className="mypage-title">🎟️ 받은 쿠폰</h2>

      <MyCouponList
        coupons={coupons}
        onDelete={deleteCoupon}
      />
    </div>
  );
}