import { DeliveryHero } from "@/features/delivery/components/DeliveryHero";
import { DeliveryHighlights } from "@/features/delivery/components/DeliveryHighlights";
import { DeliveryTable } from "@/features/delivery/components/DeliveryTable";
import { DeliveryMap } from "@/features/delivery/components/DeliveryMap";
import "./Delivery.scss";


export async function generateMetadata() {
  return {
    title: "샛별배송 안내 | Candy",
    description:
      "Candy의 샛별배송 서비스 지역, 배송 시간, 배송 방식을 안내합니다.",
  };
}

export default function Delivery() {
  return (
    <div className="delivery-info">
      <DeliveryHero />
      <DeliveryHighlights />
      <DeliveryTable />
      <DeliveryMap />
    </div>
  );
}