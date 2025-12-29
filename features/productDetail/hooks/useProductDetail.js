  "use client";

  import { useState, useEffect, useRef } from "react";
  import { useRouter, usePathname } from "next/navigation";
  import Swal from "sweetalert2";
  import { useCartQuery } from "@/features/cart/useCartQuery";
  import { api } from "@/shared/lib/axios";
  import { parseJwt } from "@/features/auth/parseJwt";
  import { useAuthStore } from "@/store/authStore";
  import { useCartStore } from "@/store/cartStore";

  export function useProductDetail(product) {
    const router = useRouter();
    const pathname = usePathname();
    const id = product?.id;

    const isLogin = useAuthStore((state) => state.isLogin);
    const userId = useAuthStore((state) => state.userId);

    const [count, setCount] = useState(1);
    
    const { cartQuery } = useCartQuery(userId);

    const { cartList } = useCartStore();

    // -------------------------
    // 2) 조회 로그 저장
    // -------------------------
    useEffect(() => {
      if (!product) return;

      try {
        const stored = localStorage.getItem("auth-storage");
        if (!stored) return;

        const { accessToken } = JSON.parse(stored).state;
        const payload = parseJwt(accessToken);

        api.post("/view/log", {
          upk: payload?.id,
          ppk: Number(id),
          categorySubId: product.categorySubId,
        });
      } catch (e) {
        console.error("조회 로그 저장 실패:", e);
      }
    }, [product,id]);

    // -------------------------
    // 3) 수량 변경
    // -------------------------
    const handleDecrease = () => {
      setCount((prev) => (prev > 1 ? prev - 1 : 1));
    };

    const handleIncrease = () => {
      if (!product) return;
      setCount((prev) => (prev < product.count ? prev + 1 : prev));
    };

    const handleChange = (e) => {
      if (!product) return;

      let num = parseInt(e.target.value.replace(/[^0-9]/g, "")) || 1;
      if (num < 1) num = 1;
      if (num > product.count) num = product.count;
      setCount(num);
    };

    // -------------------------
    // 4) 장바구니 담기
    // -------------------------
    const handleAddCart = async () => {
      if (!isLogin) {
        Swal.fire({
          icon: "warning",
          title: "⚠ 로그인 필요",
          text: "로그인이 필요합니다.",
        }).then(() => router.push(`/login?from=${pathname}`));
        return;
      }

      const cartItem = cartList?.filter(item => item.product?.id === Number(id));
      console.log("cartItem", cartItem);
      if(product.count < count + cartItem[0]?.qty) {
        Swal.fire({
        icon: "error",
        title: "장바구니 등록 실패",
        text: "선택하신 수량이 재고를 초과했습니다."
        });
        return;
      }

      try {
        const cart = {
          qty: count,
          product: { id: Number(id) },
          user: { id: userId },
        };

        const res = await api.post("/cart/add", cart);

        Swal.fire({
          icon: "success",
          title: "장바구니 등록",
          text: res.data?.isNew
            ? `${product.productName}이 장바구니에 추가되었습니다.`
            : `${product.productName}의 수량이 증가했습니다.`,
        });
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "오류 발생",
          text: "장바구니 등록에 실패했습니다.",
        });
      }
      cartQuery.refetch();
    };

    // -------------------------
    // 5) 탭 이동 — ref를 개별 변수로 분리 (중요!)
    // -------------------------
    const itemRef = useRef(null);
    const detailRef = useRef(null);
    const reviewRef = useRef(null);
    const qnaRef = useRef(null);
    const returnRef = useRef(null);

    const handleTabClick = (ref) => {
      ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    // -------------------------
    // 6) 최종가 계산
    // -------------------------
    const salesPrice = product
      ? Math.floor(product.price * ((100 - product.dc) / 100))
      : 0;

    return {
      count,
      handleDecrease,
      handleIncrease,
      handleChange,

      handleAddCart,

      itemRef,
      detailRef,
      reviewRef,
      qnaRef,
      returnRef,
      handleTabClick,

      salesPrice,
    };
  }
