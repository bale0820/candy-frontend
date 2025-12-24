"use client";

import React from "react";
import { useParams, useRouter, usePathname } from "next/navigation";

import "@/app/recipe/RecipeDetailPage.scss";
import { useRecipeDetail } from "features/recipe/recipeDetail/useRecipeDetail";
import { RelatedProductList } from "features/recipe/recipeDetail/components/RelatedProductList";
import { ReviewWriteBox } from "features/recipe/recipeDetail/components/ReviewWriteBox";
import { ReviewList } from "features/recipe/recipeDetail/components/ReviewList";
import { IMAGE_BASE_URL } from "@/shared/constants/clientEnv";

export default function RecipeDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const id = params?.id;

  const {
    recipe,
    relatedProducts,
    isLoggedIn,
    newRating,
    newContent,
    setNewRating,
    setNewContent,
    submitReview,
    currentItems,
    currentPage,
    sortedReviews,
    itemsPerPage,
    setCurrentPage,
  } = useRecipeDetail(id);

  if (!recipe) return <div>로딩중...</div>;

  const handlePrev = () =>
    setCurrentPage((p) => (p > 1 ? p - 1 : p));

  const handleNext = () =>
    setCurrentPage((p) =>
      p * itemsPerPage < sortedReviews.length ? p + 1 : p
    );

  return (
    <div className="recipe-detail-container">
      <img src={`${IMAGE_BASE_URL}/data/recipe/${recipe.imageUrl}`} className="detail-img" />

      <h1 className="detail-title">{recipe.title}</h1>
      <div className="detail-summary">{recipe.summary}</div>

      <div className="detail-info-box">
        <div className="info-item">
          ⭐ {recipe.rating} ({recipe.reviewCount})
        </div>
        <div className="info-divider" />
        <div className="info-item">⏱ {recipe.cookTime}분</div>
        <div className="info-divider" />
        <div className="info-item">난이도: {recipe.difficulty}</div>
      </div>

      <RelatedProductList relatedProducts={relatedProducts} />

      <h2 className="section-title">재료</h2>
      <ul className="ingredient-list">
        {recipe.ingredients.map((ing, i) => (
          <li key={i}>{ing}</li>
        ))}
      </ul>

      <h2 className="section-title">조리 단계</h2>
      <ol className="step-list">
        {recipe.steps.map((step, i) => (
          <li key={i}>
            <div className="step-text">{step}</div>
          </li>
        ))}
      </ol>

      <h2 className="section-title">팁</h2>
      <div className="tip-box">{recipe.tips}</div>

      {recipe.youtubeUrl && (
        <div className="youtube-box">
          <iframe
            width="100%"
            height="400"
            src={recipe.youtubeUrl.replace("watch?v=", "embed/")}
            allowFullScreen
          />
        </div>
      )}

      <h2 className="section-title">후기</h2>

      {isLoggedIn ? (
        <ReviewWriteBox
          newRating={newRating}
          newContent={newContent}
          setNewRating={setNewRating}
          setNewContent={setNewContent}
          submitReview={submitReview}
        />
      ) : (
        <div
          className="review-login-needed"
          onClick={() =>
            router.push(`/login?from=${encodeURIComponent(pathname)}`)
          }
        >
          <p>로그인 후 후기를 작성할 수 있습니다.</p>
          <button className="goto-login-btn">로그인하러 가기</button>
        </div>
      )}

      <ReviewList currentItems={currentItems} />

      <div className="pagination">
        <button onClick={handlePrev} disabled={currentPage === 1}>
          &lt;
        </button>
        <span>
          {currentPage} / {Math.ceil(sortedReviews.length / itemsPerPage)}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage * itemsPerPage >= sortedReviews.length}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
