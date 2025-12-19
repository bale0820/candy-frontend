// import axios from "axios";

// export const api = axios.create({
//   baseURL: "http://localhost:8080",   // ⭐ 절대 "/" 쓰면 안 됨
//   withCredentials: true,              // ⭐ refresh_token 쿠키 전달 필수
// });

// export function setupApiInterceptors() {
//   // ================================
//   // 1️⃣ Request Interceptor
//   // ================================
//   api.interceptors.request.use((config) => {
//     const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

//     if (loginInfo?.accessToken) {
//       config.headers.Authorization = `Bearer ${loginInfo.accessToken}`;
//     }

//     // CSRF 토큰 추가
//     const csrf = document.cookie
//       .split("; ")
//       .find((row) => row.startsWith("XSRF-TOKEN="))
//       ?.split("=")[1];

//     if (csrf) config.headers["X-XSRF-TOKEN"] = csrf;

//     return config;
//   });

//   // ================================
//   // 2️⃣ Response Interceptor
//   // ================================
//   let isRefreshing = false;
//   let refreshSubscribers = [];

//   const onRefreshed = (token) => {
//     refreshSubscribers.forEach((cb) => cb(token));
//     refreshSubscribers = [];
//   };

//   const addSubscriber = (cb) => {
//     refreshSubscribers.push(cb);
//   };

//   api.interceptors.response.use(
//     (res) => res,
//     async (error) => {
//       const originalRequest = error.config;

//       // 로그인 요청은 refresh 하지 않음
//       if (originalRequest.url === "/auth/login") {
//         return Promise.reject(error);
//       }

//       // 401 + 재시도 안 했을 때만 실행
//       if (error.response?.status === 401 && !originalRequest._retry) {
//         originalRequest._retry = true;

//         if (isRefreshing) {
//           return new Promise((resolve) => {
//             addSubscriber((token) => {
//               originalRequest.headers.Authorization = `Bearer ${token}`;
//               resolve(api(originalRequest));
//             });
//           });
//         }

//         isRefreshing = true;

//         try {
//           // Refresh 요청
//           const res = await api.post("/auth/refresh", {}, { withCredentials: true });
//           const newAccessToken = res.data.accessToken;

//           if (!newAccessToken) throw new Error("Refresh 실패: 토큰 없음");

//           // ⭐ localStorage 업데이트
//           const raw = localStorage.getItem("loginInfo");
//           const parsed = raw ? JSON.parse(raw) : {};
//           parsed.accessToken = newAccessToken;
//           localStorage.setItem("loginInfo", JSON.stringify(parsed));

//           // axios 기본 헤더 교체
//           api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;

//           // 대기 중인 요청들 다시 실행
//           onRefreshed(newAccessToken);
//           isRefreshing = false;

//           // 원래 요청 재시도
//           originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//           return api(originalRequest);

//         } catch (err) {
//           console.error("❌ Refresh 실패:", err);
//           isRefreshing = false;

//           localStorage.removeItem("loginInfo");
//           window.location.href = "/login";
//           return Promise.reject(err);
//         }
//       }

//       return Promise.reject(error);
//     }
//   );
// }
import axios from "axios";
import { API_BASE_URL } from "../constants/apiBaseUrl";

export const api = axios.create({
  baseURL: `${API_BASE_URL}`, // ⭐ 절대 "/" 쓰면 안 됨
  withCredentials: true,
});

// ================================
// ⭐ Zustand Persist 저장소에서 AccessToken 읽기
// ================================
function getAccessToken() {
  try {
    const storage = JSON.parse(localStorage.getItem("auth-storage"));
    return storage?.state?.accessToken || null;
  } catch {
    return null;
  }
}

export function setupApiInterceptors() {
  // ================================
  // 1️⃣ Request Interceptor
  // ================================
  api.interceptors.request.use((config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // CSRF Token
    const csrf = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1];

    if (csrf) config.headers["X-XSRF-TOKEN"] = csrf;

    return config;
  });

  // ================================
  // 2️⃣ Response Interceptor (Refresh)
  // ================================
  let isRefreshing = false;
  let refreshSubscribers = [];

  const onRefreshed = (token) => {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
  };

  const addSubscriber = (cb) => refreshSubscribers.push(cb);

  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;

      if (originalRequest.url === "/auth/login") {
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // 이미 Refresh 중이면 기다린다
        if (isRefreshing) {
          return new Promise((resolve) => {
            addSubscriber((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            });
          });
        }

        isRefreshing = true;

        try {
          // Refresh 요청
          const res = await api.post("/auth/refresh", {}, { withCredentials: true });
          const newAccessToken = res.data.accessToken;

          if (!newAccessToken) throw new Error("Refresh 실패");

          // ⭐ Zustand persist(auth-storage)에 accessToken 업데이트
          const storage = JSON.parse(localStorage.getItem("auth-storage")) ?? { state: {} };
          storage.state.accessToken = newAccessToken;
          localStorage.setItem("auth-storage", JSON.stringify(storage));

          // axios 기본 Authorization 헤더 동기화
          api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;

          onRefreshed(newAccessToken);
          isRefreshing = false;

          // 실패했던 원래 요청 재시도
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);

        } catch (err) {
          console.error("❌ Refresh 실패:", err);
          isRefreshing = false;

          // localStorage.removeItem("auth-storage");
          // window.location.href = "/login";
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
  );
}
