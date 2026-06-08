import type { Metadata } from "next";
import { getActiveProducts } from "@/lib/supabase/products";
import ProductCard from "@/components/product/ProductCard";

export const metadata: Metadata = {
  title: "Productos",
};

export default async function ProductosPage() {
  const products = await getActiveProducts();

  return (
    <main style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="px-4 md:px-8 py-12 max-w-screen-xl mx-auto">
        <div className="mb-10 flex items-baseline justify-between">
          <h1
            className="font-display text-4xl md:text-5xl font-semibold tracking-tight"
            style={{ color: "var(--color-ink)" }}
          >
            Productos
          </h1>
          <span
            className="font-body text-sm"
            style={{ color: "var(--color-ink-soft)" }}
          >
            {products.length} {products.length === 1 ? "artículo" : "artículos"}
          </span>
        </div>

        {products.length === 0 ? (
          <p
            className="font-body text-base py-24 text-center"
            style={{ color: "var(--color-ink-soft)" }}
          >
            No hay productos disponibles.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
