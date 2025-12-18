  // "use client";

  import { useMutation } from "@tanstack/react-query";
  import { api } from "@/shared/lib/axios";
  import { parseJwt } from "@/features/auth/parseJwt";
  import { useAuthStore } from "@/store/authStore";
  import { useCartStore } from "@/store/cartStore";
  import Swal from "sweetalert2";
  import { useRouter } from "next/navigation";
  import { useOrdersStore } from "@/store/orderStore";

  export function useLoginMutation(from = "/") {
    const login = useAuthStore((s) => s.login);
    const setCartList = useCartStore((s) => s.setCartList);
    const setOrders = useOrdersStore((s) => s.setOrders);
    const router = useRouter();

    return useMutation({
      mutationFn: async ({ userId, password }) => {
        const res = await api.post("/auth/login", { userId, password });
        return res.data;
      },

      onSuccess: async (data) => {
        const { accessToken, role } = data;
        const payload = parseJwt(accessToken);

        // 1️⃣ Zustand 로그인 저장
        login({
          accessToken,
          role,
          userId: payload.id,
        });

        // 2️⃣ 로그인 후 장바구니 로드
        try {
          const res = await api.post("/cart/cartList", {
            user: { id: payload.id },
          });
          setCartList(res.data);
        } catch (err) {
          console.error("장바구니 불러오기 실패", err);
        }
        
        // 2️⃣ 로그인 후 주문 내역 로드
        try {
          const res = await api.get(`/orders/my/${payload.id}`);
          setOrders(res.data);
        } catch (err) {
          console.error("장바구니 불러오기 실패", err);
        }

        // 3️⃣ 알림 + 이동
        Swal.fire({
          icon: "success",
          title: "로그인 성공!",
          timer: 800,
          showConfirmButton: false,
        }).then(() => router.push(from));
      },

      onError: () => {
        Swal.fire({
          icon: "error",
          title: "로그인 실패",
          text: "아이디 또는 비밀번호를 확인해주세요.",
        });
      },
    });
  }
