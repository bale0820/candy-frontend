
import { api } from "@/shared/lib/axios";


/**
    id중복 체크
*/
export const getCheckId = async (name, value) => {
  const data = { [name]: value };
  const url = "/member/idcheck";
  const result = await api.post(url, data);
  return result;
};

/**
    signup
*/
export const getSignup = async (formData) => {
  const url = "/member/signup";
  return await api.post(url, formData);
};

// /**
//     login
// */
// export const getLogout = () => async (dispatch) => {
//   dispatch(logout());
//   const url = "/auth/logout"
//   api.post(url, {});
//   return false;
// };

// export const socialApiLogin = (provider, id, accessToken) => (dispatch) => {
//   dispatch(socialLogin({ provider, id, accessToken }));
//   // ✅ 소셜 로그인도 인터셉터 활성화
//   setupApiInterceptors();
// };
