// "use client";

// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// export const useAuthStore = create(
//   persist(
//     (set) => ({
//       accessToken: null,
//       role: null,
//       userId: null,
//       provider: null,

//       // ⭐ 로그인 여부 표시
//       isLogin: false,

//       // ⭐ 일반 로그인
//       login: ({ accessToken, role, userId }) =>
//         set(() => ({
//           accessToken,
//           role,
//           userId,
//           isLogin: true,   // 추가
//         })),

//       // ⭐ 소셜 로그인
//       socialLogin: ({ provider, accessToken, userId }) =>
//         set(() => ({
//           provider,
//           accessToken,
//           userId,
//           role: "USER",
//           isLogin: true,   // 추가
//         })),

//       // ⭐ 로그아웃
//       logout: () =>
//         set(() => ({
//           accessToken: null,
//           userId: null,
//           role: null,
//           provider: null,
//           isLogin: false,  // 추가
//         })),
//     }),
//     {
//       name: "auth-storage",
//       skipHydration: true
//     }
//   )
// );
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      role: null,
      userId: null,
      isLogin: false,

      login: ({ accessToken, role, userId }) =>
        set(() => ({
          accessToken,
          role,
          userId,
          isLogin: true,
        })),

      logout: () =>
        set(() => ({
          accessToken: null,
          role: null,
          userId: null,
          isLogin: false,
        })),
    }),
    {
      name: "auth-storage",
    }
  )
);
