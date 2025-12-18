"use client";

import { SearchFilterBar } from "@/features/searchResult/components/SearchFilterBar";
import { SearchResultList } from "@/features/searchResult/components/SearchResultList";

export function SearchResultView({
  title,
  filterList,
  activeFilter,
  handleFilter,
}) {
  return (
    <div className="search-result-page">
      <h2>{title}</h2>

      <SearchFilterBar
        activeFilter={activeFilter}
        handleFilter={handleFilter}
      />

      <SearchResultList filterList={filterList} />
    </div>
  );
}
