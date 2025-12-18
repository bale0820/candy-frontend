  "use client";

  import { useRef, useState } from "react";
  import { useLoginMutation } from "./useLoginMutation";

  export function useLogin(from = "/") {
    const loginMutation = useLoginMutation(from);

    const idRef = useRef(null);
    const pwdRef = useRef(null);

    const [formData, setFormData] = useState({
      userId: "",
      password: "",
    });

    const [errors, setErrors] = useState({
      userId: "",
      password: "",
    });

    const handleFormChange = (e) => {
      const { name, value } = e.target;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // 입력 시 에러 메시지 초기화
      setErrors({
        userId: "",
        password: "",
      });
    };

    const handleLoginSubmit = async (e) => {
      e.preventDefault();

      // 로그인 요청 실행
      await loginMutation.mutateAsync(formData);
    };

    return {
      idRef,
      pwdRef,
      formData,
      errors,
      handleFormChange,
      handleLoginSubmit,
      isLoading: loginMutation.isPending,
    };
  }
