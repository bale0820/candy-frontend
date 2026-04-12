"use client";

export function ChatOrderBlock({ order }) {
  const statusLabel = (status) => {
    switch (status) {
      case "READY": return "상품 준비중";
      case "SHIPPING": return "배송 중";
      case "DELIVERED": return "배송 완료";
      default: return "상태 정보 없음";
    }
  };
  console.log("result",order);
  const getEta = (odate) => {
    if (!odate) return "";
    const date = new Date(odate);
    date.setDate(date.getDate() + 1);
    return date.toLocaleString();
  };

  const o = order;

  return (
    <div className="chat-order-block">
      <div className="order-top">
        <div className="order-top-num">
          <div className="order-top-num-left">주문번호 :</div>
          <div className="order-top-num-right">{o.orderCode}</div>
        </div>
        <div className="order-title">🛒주문상품</div>
      </div>

      {o.orderDetails?.map((d) => (
        <div key={d?.id} className="order-item">
          <img
            className="order-img"
            src={`/data/productImages/${d.product?.imageUrl}`}
            alt=""
          />
          <div className="order-info">
            <div className="name">{d.product?.productName}</div>
            <div className="qty">{d.qty.toLocaleString()}개</div>
            <div className="price">{d.product?.price.toLocaleString()}원</div>
          </div>
        </div>
      ))}

      <div className="order-title">📦 주문 정보</div>

      <div className="order-info-box">
        <div className="order-info-detail">
          <div className="order-info-left">배송상태 :</div>
          <div className="order-info-right">{statusLabel(o.deliveryStatus)}</div>
        </div>

        <div className="order-info-detail">
          <div className="order-info-left">주문일자 :</div>
          <div className="order-info-right">{new Date(o.odate).toLocaleString()}</div>
        </div>

        {o.deliveryStatus === "READY" && (
          <div className="order-info-detail">
            <div className="order-info-left">출발 예정 :</div>
            <div className="order-info-right">{getEta(o.odate)}</div>
          </div>
        )}

        {o.deliveryStatus === "SHIPPING" && (
          <div className="order-info-detail">
            <div className="order-info-left">도착 예정 :</div>
            <div className="order-info-right">
              {o.eta ? new Date(o.eta).toLocaleString() : getEta(o.odate)}
            </div>
          </div>
        )}

        {o.deliveryStatus === "DELIVERED" && (
          <div className="order-info-detail">
            <div className="order-info-left">배송 완료일 :</div>
            <div className="order-info-right">
              {o.deliveredAt
                ? new Date(o.deliveredAt).toLocaleString()
                : new Date(o.odate).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
