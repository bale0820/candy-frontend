
"use client";

import { useState } from "react";
import { MainCategory } from "@/features/category/components/MainCategory";
import { useCategoryList } from "@/features/category/hooks/useCategoryList";
import { FiMenu } from "react-icons/fi";
export function CategoryMenu() {
  const { data: categoryList } = useCategoryList();
  const [open, setOpen] = useState(false);

  return (
    <div
      className="category-first"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <FiMenu />

      {open && (
        <ul className="main-category-list">
          {categoryList?.map((main) => (
            <MainCategory
              key={main.id}
              main={main}
              closeMenu={() => setOpen(false)} // 🔥 핵심
            />
          ))}
        </ul>
      )}
    </div>
  );
}
