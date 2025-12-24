// import "./RecipePage.scss";
// import Sidebar from "features/recipe/recipePage/components/Sidebar";

// export default function RecipeLayout({ children }) {
//   return (
//     <div style={{ display: "flex" }}>
//       <Sidebar />

//       <div style={{ flex: 1, padding: "20px" }}>
//         <h2>레시피</h2>
//         {children}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Sidebar from "features/recipe/recipePage/components/Sidebar";
import "./RecipePage.scss";

export default function RecipeLayout({ children }) {
  const [open, setOpen] = useState(false);

  // 모바일에서 열릴 때 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* 모바일 햄버거 버튼 */}
      <button className="recipe-menu-btn" onClick={() => setOpen(true)}>
        ☰
      </button>

      {/* 오버레이 */}
      {open && <div className="recipe-overlay" onClick={() => setOpen(false)} />}

      <div className="recipe-layout">
        <aside className={`recipe-sidebar ${open ? "open" : ""}`}>
          <Sidebar onClose={() => setOpen(false)} />
        </aside>

        <section className="recipe-content">
          <h2 className="recipe-page-title">레시피</h2>
          {children}
        </section>
      </div>
    </>
  );
}
