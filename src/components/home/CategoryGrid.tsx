import Link from "next/link";
import Image from "next/image";
import { getActiveCategories } from "@/lib/supabase/categories";
import FadeIn from "@/components/ui/FadeIn";
import { categoriesSection } from "@/content/home";

export default async function CategoryGrid() {
  const categories = await getActiveCategories().catch(() => []);
  if (categories.length === 0) return null;

  return (
    <section
      aria-labelledby="categories-heading"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-16 md:py-20">

        <FadeIn className="mb-10 md:mb-12">
          <h2
            id="categories-heading"
            className="font-display text-3xl md:text-4xl font-semibold"
            style={{ color: "var(--color-ink)" }}
          >
            {categoriesSection.title}
          </h2>
        </FadeIn>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {categories.map((cat, i) => {
            const imgSrc = categoriesSection.imagesBySlug[cat.slug];
            return (
              <FadeIn key={cat.id} delay={i * 0.06}>
                <Link
                  href={`/productos?categoria=${cat.slug}`}
                  className="group relative block overflow-hidden"
                  style={{
                    aspectRatio: "3/4",
                    borderRadius: 3,
                    backgroundColor: "var(--color-line)",
                  }}
                >
                  {/* Imagen de fondo */}
                  {imgSrc ? (
                    <Image
                      src={imgSrc}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  ) : (
                    /* Fallback: fondo oscuro con inicial */
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ backgroundColor: "var(--color-ink)" }}
                    >
                      <span
                        className="font-display text-5xl font-semibold uppercase"
                        style={{ color: "rgba(255,255,255,0.15)" }}
                      >
                        {cat.name.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* Overlay degradado */}
                  <div
                    className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-70"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(10,10,10,0.75) 0%, rgba(10,10,10,0.15) 55%, transparent 100%)",
                    }}
                  />

                  {/* Nombre de la categoría */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p
                      className="font-display text-lg md:text-xl font-semibold uppercase tracking-wide leading-tight transition-transform duration-300 group-hover:-translate-y-0.5"
                      style={{ color: "#ffffff" }}
                    >
                      {cat.name}
                    </p>
                    <p
                      className="font-body text-xs mt-0.5 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
                      style={{ color: "rgba(255,255,255,0.75)" }}
                    >
                      Ver productos →
                    </p>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>

      </div>
    </section>
  );
}
