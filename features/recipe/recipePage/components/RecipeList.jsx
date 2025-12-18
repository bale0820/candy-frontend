import React from "react";
import { RecipeCard } from "./RecipeCard";

export function RecipeList({ recipeList }) {
  if (!Array.isArray(recipeList) || recipeList.length === 0) {
    return <p>레시피가 없습니다.</p>;
  }

  return (
    <div className="recipe-grid">
      {recipeList.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}