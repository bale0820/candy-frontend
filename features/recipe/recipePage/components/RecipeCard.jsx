"use client";

import React from "react";
// import { useNavigate } from "react-router-dom";
import { useRouter } from "next/navigation";
import { IMAGE_BASE_URL } from "@/shared/constants/clientEnv";



export function RecipeCard({ recipe }) {
  const router = useRouter();

  return (
    <div
      className="recipe-card"
      onClick={() => router.push(`/recipe/${recipe?.id}`)}
    >
      <img
        src={`${IMAGE_BASE_URL}/data${recipe.imageUrl}`}
        alt={recipe.title}
        className="recipe-img"
      />

      <div className="recipe-title">{recipe.title}</div>
      <div className="recipe-summary">{recipe.summary}</div>

      <div className="recipe-time">⏱ {recipe.cookTime}분 완성</div>
    </div>
  );
}
