"use client";

import { SubCategory } from "@/features/category/components/SubCategory";
import { useRouter } from "next/navigation";

export function MainCategory({ main, closeMenu }) {
  const router = useRouter();

  const goMain = () => {
    closeMenu(); // 🔥 먼저 닫고
    router.push(
      `/search/category/${encodeURIComponent(main.name)}?` +
        new URLSearchParams({ type: "main", id: main.id }).toString()
    );
  };

  return (
    <li className="main-category-item" onClick={goMain}>
      {main.name}

      {main.subCategories?.length > 0 && (
        <ul className="sub-category-list">
          {main.subCategories.map((sub) => (
            <SubCategory key={sub.id} sub={sub} closeMenu={closeMenu} />
          ))}
        </ul>
      )}
    </li>
  );
}
