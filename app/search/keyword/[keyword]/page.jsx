// "use client";



// import "../../SearchResult.scss";
// import { useParams } from "next/navigation";
// import { useSearchResult } from "@/features/searchResult/hooks/useSearchResult";
// import { SearchFilterBar } from "@/features/searchResult/components/SearchFilterBar";
// import { SearchResultList } from "@/features/searchResult/components/SearchResultList";



// export default function SearchResult() {
//     const params = useParams();
//     const keyword = decodeURIComponent(params.keyword);

//     const { filterList, activeFilter, handleFilter } = useSearchResult({
//         mode: "search",
//         keyword
//     });

//   return (
//     <div className="search-result-page">
//       <h2>키워드 검색 결과: "{keyword}"</h2>

//       <SearchFilterBar
//         activeFilter={activeFilter}
//         handleFilter={handleFilter}
//       />

//       <SearchResultList filterList={filterList} />
//     </div>
//   );
// }

import SearchResult from "@/features/searchResult/components/SearchResult";

export async function generateMetadata({ params }) {
  const { keyword } = await params;
  const decodeKeyword = decodeURIComponent(keyword);

  return {
    title: `"${decodeKeyword}" 검색 결과`,
    description: `"${decodeKeyword}"에 대한 상품 검색 결과 페이지입니다.`,
  };
}

export default async function Page({ params }) {
  const { keyword } = await params;
  const decodeKeyword = decodeURIComponent(keyword);

  return (
    <SearchResult
      mode="search"
      keyword={decodeKeyword}
      title={`"${decodeKeyword}" 검색 결과`}
    />
  );
}
