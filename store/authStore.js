// "use client";

// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// export const useAuthStore = create(
//   persist(
//     (set) => ({
//       accessToken: null,
//       role: null,
//       userId: null,
//       isLogin: false,

//       login: ({ accessToken, role, userId }) =>
//         set(() => ({
//           accessToken,
//           role,
//           userId,
//           isLogin: true,
//         })),

//       logout: () =>
//         set(() => ({
//           accessToken: null,
//           role: null,
//           userId: null,
//           isLogin: false,
//         })),
//     }),
//     {
//       name: "auth-storage",
//     }
//   )
// );
// store/authStore.ts
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
      _hasHydrated: false,

      login: ({ accessToken, role, userId }) =>
        set({
          accessToken,
          role,
          userId,
          isLogin: true,
        }),

      logout: () =>
        set({
          accessToken: null,
          role: null,
          userId: null,
          isLogin: false,
        }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        if (state) state._hasHydrated = true;
      },
    }
  )
);
