import Link from "next/link";
import { getFeaturedProducts } from "@/lib/supabase/products";
import ProductCard from "@/components/product/ProductCard";
import FadeIn from "@/components/ui/FadeIn";
import { featuredSection } from "@/content/home";

// Server Component — trae 4 productos destacados de Supabase y los renderiza
// con la misma ProductCard del catálogo, para consistencia visual.

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts(4).catch(() => []);
  if (products.length === 0) return null;

  return (
    <section
      aria-labelledby="featured-heading"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-16 md:py-20">

        {/* Encabezado */}
        <FadeIn className="flex items-end justify-between mb-10 md:mb-12">
          <div>
            <h2
              id="featured-heading"
              className="font-display text-3xl md:text-4xl font-semibold"
              style={{ color: "var(--color-ink)" }}
            >
              {featuredSection.title}
            </h2>
            <p
              className="font-body text-sm mt-2"
              style={{ color: "var(--color-ink-soft)" }}
            >
              {featuredSection.subtitle}
            </p>
          </div>

          {/* Ver todo — solo visible en sm+ */}
          <Link
            href={featuredSection.cta.href}
            className="hidden sm:inline-flex items-center gap-1.5 font-body text-sm transition-opacity hover:opacity-55 shrink-0 ml-6"
            style={{ color: "var(--color-ink-soft)" }}
          >
            {featuredSection.cta.label}
            <span aria-hidden="true">→</span>
          </Link>
        </FadeIn>

        {/* Grid de productos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
          {products.map((product, i) => (
            <FadeIn key={product.id} delay={i * 0.07}>
              <ProductCard product={product} />
            </FadeIn>
          ))}
        </div>

        {/* Ver todo — solo visible en mobile */}
        <div className="flex sm:hidden justify-center mt-10">
          <Link
            href={featuredSection.cta.href}
            className="font-body text-sm px-7 py-3 transition-colors hover:bg-[var(--color-surface)]"
            style={{
              border: "1px solid var(--color-line)",
              borderRadius: 2,
              color: "var(--color-ink)",
            }}
          >
            {featuredSection.cta.label}
          </Link>
        </div>

      </div>
    </section>
  );
}
