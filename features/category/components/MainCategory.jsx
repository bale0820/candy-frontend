"use client";

import { SubCategory } from "@/features/category/components/SubCategory.jsx";
import { useRouter } from "next/navigation";

export function MainCategory({ main }) {
    const router = useRouter();

    const goMain = () => {
      router.push(
    `/search/category/${encodeURIComponent(main.name)}?`
            + new URLSearchParams({ type: "main", id: main?.id }).toString()
      );
    };

    return (
        <li className="main-category-item" onClick={goMain}>
          {main.name}

          {main.subCategories?.length > 0 && (
            <ul className="sub-category-list">
              {main.subCategories.map((sub) => (
                <SubCategory key={sub?.id} sub={sub} />
              ))}
            </ul>
          )}
        </li>
    );
}
