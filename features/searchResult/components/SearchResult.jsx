"use client";

import { useSearchResult } from "@/features/searchResult/hooks/useSearchResult";
import { SearchResultView } from "@/features/searchResult/components/SearchResultView";

export default function SearchResult({ mode, keyword, cateId, title }) {
  const { filterList, activeFilter, handleFilter } = useSearchResult({
    mode,
    keyword,
    cateId,
  });

  return (
    <SearchResultView
      title={title}
      filterList={filterList}
      activeFilter={activeFilter}
      handleFilter={handleFilter}
    />
  );
}
