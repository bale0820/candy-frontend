// RecipeLayoutShell.tsx
"use client";

import { useState, useEffect } from "react";
import Sidebar from "features/recipe/recipePage/components/Sidebar";
import "./RecipePage.scss";

export default function RecipeLayoutShell({ children }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  return (
    <>
      {/* 모바일 버튼 */}
      <button
        className="recipe-menu-btn"
        onClick={() => setOpen(prev => !prev)}
      >
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <div
          className="recipe-overlay"
          onClick={() => setOpen(false)}
        />
      )}

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
