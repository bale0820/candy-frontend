import { Suspense } from "react";
import PayResult from "./PayResult";


export default function Page() {
  return (
    <Suspense fallback={<div>결제 결과 처리 중...</div>}>
      <PayResult />
    </Suspense>
  );
}
