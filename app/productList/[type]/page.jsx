import HeaderProductList from "@/features/productCategoryList/components/HeaderProductList";

export async function generateMetadata({ params }) {
  const { type } = await params;

  const titleMap = {
    new: "신상품",
    best: "베스트 상품",
    sale: "세일 상품",
    deal: "특가/혜택",
    time: "마감 임박 상품",
  };

  const title = titleMap[type] ?? "상품 목록";

  return {
    title,
    description: `${title} 목록 페이지입니다.`,
  };
}

export default async function Page({ params }) {
    const { type } = await params;
  return <HeaderProductList type={type} />;
}
