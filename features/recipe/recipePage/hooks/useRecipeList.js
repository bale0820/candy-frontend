// features/recipe/recipePage/hooks/useRecipeList.ts
"use client";

import { useEffect, useState } from "react";
import { getRecipeListAPI } from "@/shared/utils/recipeAPI";

export function useRecipeList(selectedSub) {
  const [recipeList, setRecipeList] = useState([]);

  useEffect(() => {
    if (!selectedSub) {
      setRecipeList([]);
      return;
    }

    const fetch = async () => {
      const result = await getRecipeListAPI(selectedSub);
      setRecipeList(result);
    };

    fetch();
  }, [selectedSub]);

  return recipeList;
}