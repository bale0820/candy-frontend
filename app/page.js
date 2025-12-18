import Home from "@/features/home/home";
import { getAdvertiseList } from "@/features/home/server/advertise";
import { getHomeImages } from "@/features/home/server/homeImages";
import ProductListServer from "@/shared/ui/productList/ProductListServer";



export const metadata = {
  title: "Candy Market | 할인·특가 쇼핑몰",
  description: "원딜핫딜, 멤버특가 등 실시간 인기 상품을 가장 빠르게 만나보세요.",
};

  export default async function Page() {
    const { bannerAds, inlineAds } = await getAdvertiseList();
      const images = await getHomeImages();
    
      return (
        <Home
          bannerAds={bannerAds}
          inlineAds={inlineAds}
          images={images}
        >
          {/* 👇 서버 컴포넌트들을 여기서 끼운다! */}
          <ProductListServer
            title="마감 임박! 원더특가 ~66%"
            keyword="time"
            limit={12}
          />
    
          <ProductListServer
            title="실시간 인기 랭킹"
            keyword="sale"
            limit={12}
          />
    
          <ProductListServer
            title="할인을 잡아라!!"
            keyword="sale"
            limit={12}
          />
        </Home>
      );
  }
