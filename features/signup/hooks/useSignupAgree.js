// "use client";

// import { useState, useEffect } from "react";
// import { api } from "@/shared/lib/axios";
// import { IMAGE_BASE_URL } from "@/shared/constants/clientEnv";

// export function useSignupAgree() {
//   const [hoveredId, setHoveredId] = useState(null);
//   const [termList, setTermList] = useState([]);

//   const [agree, setAgree] = useState({
//     all: false,
//     terms: false,
//     privacy: false,
//     marketing: false,
//     benefit: false,
//     sms: false,
//     email: false,
//     age: false,
//   });

//   useEffect(() => {
//     const load = async () => {
//       const result = await api.get(`${IMAGE_BASE_URL}/data/jsonData/terms.json`);
//       setTermList(result.data.terms);
//     };
//     load();
//   }, []);

//   const handleAllAgree = (e) => {
//     const c = e.target.checked;
//     setAgree({
//       all: c,
//       terms: c,
//       privacy: c,
//       marketing: c,
//       benefit: c,
//       sms: c,
//       email: c,
//       age: c,
//     });
//   };

//   const handleAgreeChange = (e) => {
//     const { name, checked } = e.target;

//     let updated = { ...agree, [name]: checked };

//     if (name === "benefit") {
//       updated.sms = checked;
//       updated.email = checked;
//     }

//     updated.benefit = updated.sms && updated.email;

//     const allChecked =
//       updated.terms &&
//       updated.privacy &&
//       updated.marketing &&
//       updated.sms &&
//       updated.email &&
//       updated.age;

//     updated.all = allChecked;

//     setAgree(updated);
//   };

//   return {
//     agree,
//     termList,
//     hoveredId,
//     setHoveredId,
//     handleAgreeChange,
//     handleAllAgree,
//   };
// }
"use client";

import { useState, useEffect } from "react";
import { IMAGE_BASE_URL } from "@/shared/constants/clientEnv";

export function useSignupAgree() {
  const [hoveredId, setHoveredId] = useState(null);
  const [termList, setTermList] = useState([]);

  const [agree, setAgree] = useState({
    all: false,
    terms: false,
    privacy: false,
    marketing: false,
    benefit: false,
    sms: false,
    email: false,
    age: false,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `${IMAGE_BASE_URL}/data/jsonData/terms.json`,
          { cache: "no-store" }
        );

        const data = await res.json();

        // ✅ 구조 방어 (실무 필수)
        setTermList(Array.isArray(data?.terms) ? data.terms : []);
      } catch (e) {
        console.error("약관 로딩 실패", e);
        setTermList([]);
      }
    };

    load();
  }, []);

  const handleAllAgree = (e) => {
    const c = e.target.checked;
    setAgree({
      all: c,
      terms: c,
      privacy: c,
      marketing: c,
      benefit: c,
      sms: c,
      email: c,
      age: c,
    });
  };

  const handleAgreeChange = (e) => {
    const { name, checked } = e.target;

    let updated = { ...agree, [name]: checked };

    if (name === "benefit") {
      updated.sms = checked;
      updated.email = checked;
    }

    updated.benefit = updated.sms && updated.email;

    const allChecked =
      updated.terms &&
      updated.privacy &&
      updated.marketing &&
      updated.sms &&
      updated.email &&
      updated.age;

    updated.all = allChecked;

    setAgree(updated);
  };

  return {
    agree,
    termList,
    hoveredId,
    setHoveredId,
    handleAgreeChange,
    handleAllAgree,
  };
}
