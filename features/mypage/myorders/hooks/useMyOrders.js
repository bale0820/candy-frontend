"use client"
// features/order/hooks/useMyOrders.js
import { useState } from "react";
import Swal from "sweetalert2";
import { parseJwt } from "@/features/auth/parseJwt";
import { api } from "@/shared/lib/axios";
import { useOrdersStore } from "@/store/orderStore";
import { useMyOrdersQuery } from "@/features/mypage/myorders/hooks/useMyOrdersQuery";
import { useCartQuery } from "@/features/cart/useCartQuery";
import { orderAPI } from "../api/orderAPI";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useProductList } from "@/features/product/hooks/useProductList";

export function useMyOrders(itemsPerPage = 4) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  
  // 🔹 로그인 User ID를 초기값에서 바로 계산
  const [userId] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("auth-storage");
      if (stored) {
        const { accessToken } = JSON.parse(stored).state;
        const payload = parseJwt(accessToken);
        return payload?.id;
      }
    }
    return null;
  });

  // 🔹 Zustand 상태
  const {orders} = useOrdersStore();
  const {cartList} = useCartStore();
  const productList = useProductList();

  // 🔹 React Query (userId 준비될 때만 실행됨)
  const {ordersQuery, deleteMutation} = useMyOrdersQuery(userId);
  const { cartQuery } = useCartQuery(userId);
  

  /** 주문 삭제 */
  const deleteOrder = async (orderCode) => {
    try {
      const res = await orderAPI.deleteOrder(userId, orderCode);

      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          title: "삭제 완료",
          text: "주문이 삭제되었습니다.",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "삭제 실패",
        text: "주문을 삭제할 수 없습니다.",
      });
    }
    ordersQuery.refetch();
  };

  /** 페이지네이션 */
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const currentItems = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const nextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const goProduct = (ppk) => {
    router.push(`/products/${ppk}`);
  }
  
  /** 장바구니 추가 */
  const handleAddCart = async (item) => {
    const cartItem = cartList?.filter(cItem => cItem.product?.id === item.ppk);
    const product = productList?.data.filter(pItem => pItem?.id === item.ppk);
    if(product[0]?.count <= cartItem[0]?.qty) {
      Swal.fire({
      icon: "error",
      title: "장바구니 등록 실패",
      text: "선택하신 수량이 재고를 초과했습니다."
      });
      return;
    }
    
    const cart = {
      qty: 1,
      product: { id: item.ppk },
      user: { id: userId },
    };
    
    const res = await api.post("/cart/add", cart);
    const isNew = (res.data.qty === 1 ? true : false);

    if (isNew) {
      Swal.fire({
        icon: "success",
        title: "장바구니 등록",
        text: `${item.productName}이 장바구니에 추가되었습니다.`,
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "수량 증가",
        text: `${item.productName} 수량이 증가했습니다.`,
      });
    }
    cartQuery.refetch();
  };

  return {
    userId,
    orders,
    currentItems,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    deleteOrder,
    goProduct,
    handleAddCart,
  };
}
