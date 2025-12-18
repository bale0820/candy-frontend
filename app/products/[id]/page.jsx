import { getProductDetail } from "@/features/productDetail/server/getProductDetail";
import ProductDetail from "./ProductDetail";
import { IMAGE_BASE_URL } from "@/shared/constants/imageBaseUrl";

// ✅ SEO
export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProductDetail(id);

  return {
    title: `[${product.brandName}] ${product.productName}`,
    description: `${product.productName} - ${product.origin}, ${product.price.toLocaleString()}원`,
    openGraph: {
      title: product.productName,
      description: product.productName,
      images: [
        {
          url: `${IMAGE_BASE_URL}/productImages/${product.imageUrl}`,
        },
      ],
    },
  };
}

export default async function Page({ params }) {
  const { id } = await params;
  const product = await getProductDetail(id);

  return (
    <>
      {/* ✅ JSON-LD (SEO 핵심) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.productName,
            image: [
              `${IMAGE_BASE_URL}/productImages/${product.imageUrl}`,
            ],
            brand: {
              "@type": "Brand",
              name: product.brandName,
            },
            offers: {
              "@type": "Offer",
              priceCurrency: "KRW",
              price: Math.floor(
                product.price * ((100 - product.dc) / 100)
              ),
              availability:
                product.count > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
            },
          }),
        }}
      />

      <ProductDetail product={product} />
    </>
  );
}
