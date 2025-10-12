import Footer1 from "@/presentation/components/footers/Footer1";
import Header1 from "@/presentation/components/headers/Header1";
import Topbar1 from "@/presentation/components/headers/Topbar1";
import Banner from "@/presentation/components/homes/home-1/Banner";
import Banner2 from "@/presentation/components/common/Banner2";
import Collections from "@/presentation/components/homes/home-1/Collections";
import Features from "@/presentation/components/common/Features";
import Hero from "@/presentation/components/homes/home-1/Hero";
import Product2 from "@/presentation/components/common/Product3";
import Products1 from "@/presentation/components/homes/home-1/Products1";
import Products3 from "@/presentation/components/homes/home-1/Products3";
import Products4 from "@/presentation/components/homes/home-5/Products4";
import Products5 from "@/presentation/components/common/Products";
import Products6 from "@/presentation/components/common/RecentProducts";

export const metadata = {
  title: "Home || SHIPAZO - Multipurpose React Nextjs eCommerce",
  description: "SHIPAZO - Multipurpose React Nextjs eCommerce",
};
export default function Home() {
  return (
    <>
      <Topbar1 />
      <Header1 />
      <Hero />
      <Features />
      <Products1 />
      <Product2 />
      <Products3 />
      <Collections />
      <Products4 />
      <Banner />
      <Products5 />
      <Banner2 />
      <Products6 />
      <Footer1 />
    </>
  );
}

