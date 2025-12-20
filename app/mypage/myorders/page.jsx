"use client"

import Swal from "sweetalert2";

// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { addCart } from "features/cart/cartAPI";
import { OrderCard } from "@/features/mypage/myorders/components/OrderCard";
import { OrderPagination } from "@/features/mypage/myorders/components/OrderPagination";
import { useMyOrders } from "@/features/mypage/myorders/hooks/useMyOrders";


export default function MyOrders() {
  const {
    userId,
    currentItems,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    deleteOrder,
    goProduct,
    handleAddCart,
  } = useMyOrders(4);

  return (
    <div className="mypage-container">
      {currentItems.length === 0 ? (
        <p>주문 내역이 없습니다.</p>
      ) : (
        currentItems.map((order) => (
          <OrderCard
            key={order?.id}
            order={order}
            goProduct={goProduct}
            handleAddCart={handleAddCart}
            onDelete={() => deleteOrder(order.orderCode)}
          />
        ))
      )}

      {totalPages > 1 && (
        <OrderPagination
          currentPage={currentPage}
          totalPages={totalPages}
          nextPage={nextPage}
          prevPage={prevPage}
        />
      )}
    </div>
  );
}