"use client";

import {MainCategory} from "@/features/category/components/MainCategory";
import {useCategoryList} from "@/features/category/hooks/useCategoryList.js";

export function CategoryMenu() {
    const {
        data: categoryList
    } = useCategoryList();

  return (
    
    <ul className="main-category-list">
      
      {categoryList?.map((main) => (
        <MainCategory key={main?.id} main={main} />
      ))}
    </ul>
  );
}
