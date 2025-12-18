// shared/ui/productList/ProductListServer.jsx

import ProductList from "./ProductList";
import { getProductList } from "./server/getProductList";

export default async function ProductListServer({
  title,
  keyword,
  limit = 20,
}) {
  // ✅ 서버에서 상품 데이터 가져오기
  const productList = await getProductList();

  // ❗ 아직 필터링은 안 한다 (다음 단계)
  return (
    <ProductList
      title={title}
      keyword={keyword}
      limit={limit}
      serverProducts={productList}
    />
  );
}
