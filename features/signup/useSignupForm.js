"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useDaumPostcodePopup } from "react-daum-postcode";

import { getCheckId, getSignup } from "@/features/auth/authAPI";
import { validateSignup } from "@/features/signup/SignupValidation";

export function useSignupForm() {
  const router = useRouter();
  const open = useDaumPostcodePopup(
    "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
  );

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  // -------------------------------------------------------------------
  // 1️⃣ 초기 key 목록(useMemo로 고정)
  // -------------------------------------------------------------------
  const initArray = useMemo(
    () => [
      "userId",
      "password",
      "cpwd",
      "name",
      "phone",
      "address",
      "addressDetail",
      "emailName",
      "emailDomain",
      "emailDomainInput",
      "gender",
      "dateYear",
      "dateMonth",
      "dateDay",
      "recommendation",
      "zonecode",
    ],
    []
  );

  const numericOnly = ["phone", "dateYear", "dateMonth", "dateDay"];

  const initForm = (arr) =>
    arr.reduce((acc, cur) => {
      acc[cur] = "";
      return acc;
    }, {});

  // -------------------------------------------------------------------
  // 2️⃣ form 상태
  // -------------------------------------------------------------------
  const [form, setForm] = useState({
    ...initForm(initArray),
    emailDomain: "선택하기",
  });

  const refs = useRef(null);

if (refs.current === null) {
  refs.current = initArray.reduce((acc, cur) => {
    acc[`${cur}Ref`] = React.createRef();
    return acc;
  }, {});
}

  // -------------------------------------------------------------------
  // 4️⃣ 주소 상태
  // -------------------------------------------------------------------
  const [userFullAddress, setUserFullAddress] = useState("");

  // -------------------------------------------------------------------
  // 5️⃣ 폼 입력 처리
  // -------------------------------------------------------------------
  const handleChangeForm = (e) => {
    const { name, value } = e.target;

    if (numericOnly.includes(name) && !/^\d*$/.test(value)) return;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  console.log("form", form);
  // -------------------------------------------------------------------
  // 6️⃣ 주소 검색
  // -------------------------------------------------------------------
  const handleClickAddress = () => open({ onComplete });

  const onComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = "";
    let zonecode = data.zonecode;

    if (data.addressType === "R") {
      if (data.bname) extraAddress += data.bname;
      if (data.buildingName)
        extraAddress += extraAddress
          ? `, ${data.buildingName}`
          : data.buildingName;

      fullAddress += extraAddress ? ` (${extraAddress})` : "";
    }

    setUserFullAddress(fullAddress);
    setForm((prev) => ({ ...prev, zonecode }));
  };

  // -------------------------------------------------------------------
  // 7️⃣ 아이디 중복 체크
  // -------------------------------------------------------------------
  const handleIdCheck = async (e) => {
    const userId = form.userId.trim();

  if (!userId) {
    Swal.fire({
      icon: "error",
      title: "중복체크 결과",
      text: "❌ 아이디를 입력해주세요.",
    });
    return;
  }

  const result = await getCheckId("userId", userId);

    Swal.fire({
      icon: result.data ? "error" : "success",
      title: "중복체크 결과",
      text: result.data
        ? "❌ 존재하는 아이디입니다."
        : "✅ 사용가능한 아이디입니다.",
    });
  };

  // -------------------------------------------------------------------
  // 8️⃣ 회원가입 제출
  // -------------------------------------------------------------------
  const handleSubmit = async (e, agree) => {
    e.preventDefault();

    const email =
      form.emailDomain === ""
        ? form.emailName + form.emailDomainInput
        : form.emailName + form.emailDomain;

    const formData = {
      ...form,
      email,
      birthday: `${form.dateYear}-${form.dateMonth}-${form.dateDay}`,
      phone: `${form.phone.slice(0, 3)}-${form.phone.slice(3, 7)}-${form.phone.slice(7)}`,
      address: `${userFullAddress} ${form.addressDetail}`,
    };

    // 유효성 검사
    const errors = validateSignup(formData);
    if (Object.keys(errors).length > 0) {
      Swal.fire({ icon: "error", title: "회원가입 실패", text: errors });
      return;
    }

    // 필수 약관 체크
    if (!agree.terms || !agree.privacy || !agree.age) {
      Swal.fire({
        icon: "error",
        title: "회원가입 실패",
        text: "필수 이용 약관을 동의해주세요.",
      });
      return;
    }

    // 서버 요청
    const result = await getSignup(formData);

    if (result) {
      Swal.fire({
        icon: "success",
        title: "회원가입 성공",
      }).then(() => router.push("/login"));
    } else {
      Swal.fire({
        icon: "error",
        title: "회원가입 실패",
      });
    }
  };

  // -------------------------------------------------------------------
  // 반환 (렌더 중 ref.current 접근 ❌)
  // -------------------------------------------------------------------
  return {
    form,
    refs,
    userFullAddress,
    handleChangeForm,
    handleClickAddress,
    setUserFullAddress,
    handleIdCheck,
    handleSubmit,
  };
}
