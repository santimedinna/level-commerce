import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategoryGrid from "@/components/home/CategoryGrid";
import Testimonials from "@/components/home/Testimonials";
import ClosingSection from "@/components/home/ClosingSection";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TrustBar />
      <FeaturedProducts />
      <CategoryGrid />
      <Testimonials />
      <ClosingSection />
    </main>
  );
}
