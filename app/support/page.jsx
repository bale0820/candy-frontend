import { FaPhoneAlt, FaEnvelope, FaQuestionCircle } from "react-icons/fa";
import "./CustomerService.scss";
import { CustomerCard } from "@/features/support/CustomerCard";

export async function generateMetadata() {
  return {
    title: "고객센터 | Candy",
    description: "전화, 이메일, FAQ를 통해 고객 지원을 제공합니다.",
  };
}


export default function CustomerServicePage() {
  return (
    <div className="customer-service">
      <h1 className="title">고객센터</h1>
      <p className="subtitle">언제나 고객님의 편의를 위해 최선을 다하겠습니다.</p>

      <div className="service-grid">
        <CustomerCard icon={<FaPhoneAlt />} title="전화 문의">
          <p>대표번호: 1544-1234</p>
          <p>평일 09:00 ~ 18:00 (주말 및 공휴일 휴무)</p>
        </CustomerCard>

        <CustomerCard icon={<FaEnvelope />} title="이메일 문의">
          <p>help@candyshop.com</p>
          <p>24시간 접수 가능 (영업일 기준 1~2일 내 답변)</p>
        </CustomerCard>

        <CustomerCard icon={<FaQuestionCircle />} title="자주 묻는 질문 (FAQ)">
          <p>배송, 교환, 환불 관련 자주 묻는 내용을 확인하세요.</p>
          <button className="btn">FAQ 바로가기</button>
        </CustomerCard>
      </div>
    </div>
  );
}

