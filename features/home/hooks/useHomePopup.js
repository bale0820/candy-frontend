// "use client";

// import { useEffect, useState } from "react";

// export function useHomePopup() {
//   const [showPopup, setShowPopup] = useState(false);

//   useEffect(() => {
//     const isShown = localStorage.getItem("coupon_popup_shown");
//     if (!isShown) {
//       setShowPopup(true);
//     }
//   }, []);

//   const handleClosePopup = () => {
//     localStorage.setItem("coupon_popup_shown", "true");
//     setShowPopup(false);
//   };

//   return { showPopup, handleClosePopup };
// }
"use client";

import { useEffect, useState } from "react";

const HIDE_MINUTES = 10; // ⏱ 10분 뒤 다시 표시

export function useHomePopup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const hideUntil = localStorage.getItem("coupon_popup_hide_until");

    if (!hideUntil) {
      // 처음 방문
      setShowPopup(true);
      return;
    }

    const now = Date.now();

    if (now > Number(hideUntil)) {
      // 만료 → 다시 표시
      setShowPopup(true);
    }
  }, []);

  const handleClosePopup = () => {
    const hideUntil = Date.now() + HIDE_MINUTES;
    localStorage.setItem(
      "coupon_popup_hide_until",
      String(hideUntil)
    );
    setShowPopup(false);
  };

  const handleHideToday = () => {
  const now = new Date();

  // 오늘 23:59:59
  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23, 59, 59, 999
  ).getTime();

  localStorage.setItem(
    "coupon_popup_hide_until",
    String(endOfToday)
  );

  setShowPopup(false);
};


  return { showPopup, handleClosePopup, handleHideToday };
}
