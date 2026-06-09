import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/supabase/products";
import { formatPrice } from "@/lib/colors";
import VariantSelector from "@/components/product/VariantSelector";
import ProductCard from "@/components/product/ProductCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado" };
  return { title: product.name };
}

export default async function ProductoDetallePage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const image =
    (product.images as string[])[0] ?? "https://placehold.co/600x800";

  return (
    <main style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        {/* Back link */}
        <div className="py-6">
          <Link
            href="/productos"
            className="font-body text-sm"
            style={{ color: "var(--color-ink-soft)" }}
          >
            ← Productos
          </Link>
        </div>

        {/* Product layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-16 pb-16">
          {/* Image */}
          <div className="lg:sticky lg:top-8 self-start">
            <div
              className="relative overflow-hidden w-full"
              style={{
                aspectRatio: "3/4",
                backgroundColor: "var(--color-surface)",
              }}
            >
              <Image
                src={image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6 py-1">
            <div>
              <h1
                className="font-display text-3xl md:text-4xl font-semibold leading-tight tracking-tight"
                style={{ color: "var(--color-ink)" }}
              >
                {product.name}
              </h1>
              <p
                className="font-body text-2xl mt-3"
                style={{ color: "var(--color-ink)" }}
              >
                {formatPrice(product.base_price)}
              </p>
            </div>

            {product.description && (
              <>
                <div
                  style={{ borderTop: "1px solid var(--color-line)" }}
                  className="pt-6"
                >
                  <p
                    className="font-body text-sm leading-relaxed"
                    style={{ color: "var(--color-ink-soft)" }}
                  >
                    {product.description}
                  </p>
                </div>
              </>
            )}

            <div style={{ borderTop: "1px solid var(--color-line)" }} className="pt-6">
              <VariantSelector variants={product.product_variants} />
            </div>
          </div>
        </div>

        {/* Productos relacionados */}
        {product.related.length > 0 && (
          <section
            className="py-12"
            style={{ borderTop: "1px solid var(--color-line)" }}
          >
            <h2
              className="font-display text-2xl font-semibold mb-8"
              style={{ color: "var(--color-ink)" }}
            >
              También te puede gustar
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
              {product.related.map((related) => (
                <ProductCard key={related.id} product={related} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
