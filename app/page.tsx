import HeroSection from "@/components/landing/HeroSection";
import TopTenCarousel from "@/components/landing/TopTenCarousel";
import FlashSale from "@/components/landing/FlashSale";
import AuthenticBadge from "@/components/landing/AuthenticBadge";
import NewArrival from "@/components/landing/NewArrival";
import BrandSpotlight from "@/components/landing/BrandSpotlight";
import MemberCTA from "@/components/landing/MemberCTA";
import CategoryShowcase from "@/components/landing/CategoryShowcase";
import TrustSignals from "@/components/landing/TrustSignals";
import {
  getTopProducts,
  getSaleEndTime,
  getNewestProduct,
  getEssensorieProducts,
} from "@/app/utils/actions";

export default async function Home() {
  const [topProducts, saleEndTime, newestProduct, essensorieProducts] =
    await Promise.all([
      getTopProducts(),
      getSaleEndTime(),
      getNewestProduct(),
      getEssensorieProducts(),
    ]);

  // Negative margins cancel the layout.tsx padding wrapper (px-5 lg:pl-20/px-15, mt-4 ×2)
  // so landing sections are full-bleed. Other pages have their own containers.
  return (
    <div className="-mx-5 -mt-8 lg:-ml-20 lg:-mr-15">
      <HeroSection />
      <TopTenCarousel products={topProducts} />
      <FlashSale endTime={saleEndTime} />
      <AuthenticBadge />
      <NewArrival product={newestProduct} />
      <BrandSpotlight products={essensorieProducts} />
      <MemberCTA />
      <CategoryShowcase />
      <TrustSignals />
    </div>
  );
}
