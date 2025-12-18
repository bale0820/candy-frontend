"use client";

import { useProductReviewList } from "@/features/product/hooks/useProductReviewList";
import { useMemo, useState } from "react";

export function useReviewList() {
  const {data : reviewsAll = []} = useProductReviewList();
  const [search, setSearch] = useState("");

  const grouped = useMemo(() => {
    return reviewsAll.reduce((acc, r) => {
      if (!acc[r.ppk]) {
        acc[r.ppk] = {
          ppk: r.ppk,
          productName: r.product_name,
          count: 0,
        };
      }
      acc[r.ppk].count++;
      return acc;
    }, {});
  }, [reviewsAll]);

  const list = Object.values(grouped);

  const filtered = list.filter((item) =>
    item.productName.toLowerCase().includes(search.toLowerCase())
  );

  const summary = useMemo(() => {
    const totalReviews = reviewsAll.length;

    let positive = 0;
    let negative = 0;

    reviewsAll.forEach((r) => {
      if (
        r.content.includes("맛있") ||
        r.content.includes("좋") ||
        r.content.includes("추천") ||
        r.likes >= 5
      ) {
        positive++;
      } else {
        negative++;
      }
    });

    const topProducts = [...list]
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return { totalReviews, positive, negative, topProducts };
  }, [reviewsAll, list]);

  return { search, setSearch, summary, filtered };
}
