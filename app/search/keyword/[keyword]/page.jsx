
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
